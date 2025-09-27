import { User } from '@/core/entities/user-entity';
import { AllPocket, CreatePocketRequest, PocketFilter, PocketInsert, PocketSelect } from './pocket.schema';
import { db } from 'db';
import { pockets } from 'db/schemas/pockets';
import { and, desc, eq, ilike, not } from 'drizzle-orm';
import { savingPockets } from 'db/schemas/saving-pockets';
import { recurringPockets } from 'db/schemas/recurring-pockets';
import { spendingPockets } from 'db/schemas/spending-pockets';
import { POCKET_TYPE } from '@/core/constants/pocket-type';
import { Wallet } from '../wallets/wallet.dto';

export abstract class PocketService {
  static async createUnique(user: User, payload: PocketInsert): Promise<PocketSelect> {
    const [pocket] = await db
      .insert(pockets)
      .values({ ...payload, userId: user.uid })
      .onConflictDoUpdate({ target: pockets.userId, set: { userId: user.uid } })
      .returning();

    return pocket;
  }

  static async create(user: User, payload: CreatePocketRequest, wallet: Wallet): Promise<PocketSelect> {
    // const [pocket] = await db
    //   .insert(pockets)
    //   .values({ ...payload, userId: user.uid })
    //   .returning();

    const pocket = await db.transaction(async (tx) => {
      const [pocket] = await tx
        .insert(pockets)
        .values({ ...payload, userId: user.uid })
        .returning();

      if (pocket.type === POCKET_TYPE.SPENDING) {
        await tx.insert(spendingPockets).values({
          walletId: wallet.id,
          pocketId: pocket.id,
          userId: user.uid,
        });
      } else if (pocket.type === POCKET_TYPE.SAVING) {
        await tx.insert(savingPockets).values({
          walletId: wallet.id,
          pocketId: pocket.id,
          userId: user.uid,
        });
      } else if (pocket.type === POCKET_TYPE.RECURRING) {
        await tx.insert(recurringPockets).values({
          walletId: wallet.id,
          pocketId: pocket.id,
          userId: user.uid,
        });
      }
      return pocket;
    })

    return pocket;
  }

  static async get(user: User): Promise<PocketSelect> {
    const [pocket] = await db
      .select()
      .from(pockets)
      .where(eq(pockets.userId, user.uid))
      .limit(1);

    return pocket;
  }

  static async list(user: User, query?: PocketFilter): Promise<AllPocket[]> {
    const queries = [
      eq(pockets.userId, user.uid),
    ]

    if (query?.type) {
      queries.push(eq(pockets.type, query.type));
    } else {
      queries.push(not(eq(pockets.type, POCKET_TYPE.WALLET)));
    }

    if (query?.keyword) {
      queries.push(ilike(pockets.name, `%${query.keyword}%`));
    }

    const allPockets = await db
      .select()
      .from(pockets)
      .where(and(...queries))
      .leftJoin(savingPockets, eq(pockets.id, savingPockets.pocketId))
      .leftJoin(recurringPockets, eq(pockets.id, recurringPockets.pocketId))
      .leftJoin(spendingPockets, eq(pockets.id, spendingPockets.pocketId))
      .orderBy(desc(pockets.createdAt))

    return allPockets.map((pocket) => ({
      ...pocket.pockets,
      saving: pocket.saving_pockets,
      recurring: pocket.recurring_pockets,
      spending: pocket.spending_pockets,
    }));
  }
}
