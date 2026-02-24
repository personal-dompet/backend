import { User } from '@/core/dto/user';
import { CreateRecurringPocket, RecurringPocketSelect } from './recurring-pocket.schema';
import { recurringPockets } from 'db/schemas/recurring-pockets';
import { Wallet } from '@/api/wallets/wallet.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Drizzle } from 'db';
import { PocketSelect } from '../pocket.schema';
import { pockets } from 'db/schemas/pockets';
import { and, eq } from 'drizzle-orm';

export class RecurringPocketService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async create(user: User, payload: CreateRecurringPocket, wallet: Wallet): Promise<PocketSelect & RecurringPocketSelect> {
    const recurringPocket = await this.db.transaction(async (tx) => {
      const [pocket] = await tx
        .insert(pockets)
        .values({
          ...payload,
          userId: user.uid,
        })
        .returning();

      const [recurringPocket] = await tx
        .insert(recurringPockets)
        .values({
          ...payload,
          walletId: wallet.id,
          pocketId: pocket.id,
          userId: user.uid,
        })
        .returning();

      return {
        ...pocket,
        ...recurringPocket,
      };
    });
    return recurringPocket;
  }

  async detail(pocketId: number): Promise<RecurringPocketSelect> {
    const [recurringPocket] = await this.db
      .select()
      .from(recurringPockets)
      .where(eq(recurringPockets.pocketId, pocketId),)
      .limit(1);

    return recurringPocket;
  }
}
