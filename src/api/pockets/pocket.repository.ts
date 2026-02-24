import { AppRepository } from '@/core/lib/app-repository';
import { PocketInsert, PocketSelect } from './pocket.schema';
import { User } from '@/core/schemas/user';
import { pocketColumns } from './pocket.column';
import { savingPocketColumns } from './saving/saving.column';
import { spendingPocketColumns } from './spending/spending.column';
import { recurringPocketColumns } from './recurring/recurring.column';
import { walletColumns } from './wallet/wallet.column';
import { pockets } from 'db/schemas/pockets';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { savingPockets } from 'db/schemas/saving-pockets';
import { POCKET_TYPE } from '@/core/constants/pocket-type';
import { spendingPockets } from 'db/schemas/spending-pockets';
import { recurringPockets } from 'db/schemas/recurring-pockets';
import { walletPockets } from 'db/schemas/wallet-pockets';
import { RecurringSelect } from './recurring/recurring.schema';
import { SavingSelect } from './saving/saving.schema';
import { SpendingSelect } from './spending/spending.schema';

export class PocketRepository extends AppRepository {
  async list(user: User): Promise<PocketSelect[]> {
    const list = await this.db
      .select({
        ...pocketColumns,
        saving: savingPocketColumns,
        spending: spendingPocketColumns,
        recurring: recurringPocketColumns,
        wallet: walletColumns,
      })
      .from(pockets)
      .where(and(isNull(pockets.deletedAt), eq(pockets.userId, user.uid)))
      .leftJoin(
        savingPockets,
        and(
          eq(savingPockets.pocketId, pockets.id),
          eq(pockets.type, POCKET_TYPE.SAVING),
        ),
      )
      .leftJoin(
        spendingPockets,
        and(
          eq(spendingPockets.pocketId, pockets.id),
          eq(pockets.type, POCKET_TYPE.SPENDING),
        ),
      )
      .leftJoin(
        recurringPockets,
        and(
          eq(recurringPockets.pocketId, pockets.id),
          eq(pockets.type, POCKET_TYPE.RECURRING),
        ),
      )
      .leftJoin(
        walletPockets,
        and(
          eq(walletPockets.pocketId, pockets.id),
          eq(pockets.type, POCKET_TYPE.WALLET),
        ),
      )
      .orderBy(desc(pockets.createdAt));

    return list;
  }

  async create(user: User, payload: PocketInsert): Promise<PocketSelect> {
    const pocket = await this.db.transaction(async (tx) => {
      const [_pocket] = await tx
        .insert(pockets)
        .values({
          ...payload,
          userId: user.uid,
        })
        .returning(pocketColumns)

      let recurringPocket: RecurringSelect | undefined;
      let savingPocket: SavingSelect | undefined;
      let spendingPocket: SpendingSelect | undefined;

      if (_pocket.type === POCKET_TYPE.RECURRING) {
        const [result] = await tx
          .insert(recurringPockets)
          .values({
            ...payload,
            pocketId: _pocket.id,
            userId: user.uid,
          })
          .returning(recurringPocketColumns);

        recurringPocket = result;
      }

      if (_pocket.type === POCKET_TYPE.SAVING) {
        const [result] = await tx
          .insert(savingPockets)
          .values({
            ...payload,
            pocketId: _pocket.id,
            userId: user.uid,
          })
          .returning(savingPocketColumns);

        savingPocket = result;
      }

      if (_pocket.type === POCKET_TYPE.SPENDING) {
        const [result] = await tx
          .insert(spendingPockets)
          .values({
            ...payload,
            pocketId: _pocket.id,
            userId: user.uid,
          })
          .returning(spendingPocketColumns);

        spendingPocket = result;
      }

      const response: PocketSelect = {
        ..._pocket,
        recurring: recurringPocket,
        saving: savingPocket,
        spending: spendingPocket,
      }

      return response;
    });

    return pocket;
  }

  async get(user: User, id: number): Promise<PocketSelect> {
    const [pocket] = await this.db
      .select(pocketColumns)
      .from(pockets)
      .where(and(
        isNull(pockets.deletedAt),
        eq(pockets.id, id),
        eq(pockets.userId, user.uid),
      ))
      .limit(1);

    return pocket;
  }
}