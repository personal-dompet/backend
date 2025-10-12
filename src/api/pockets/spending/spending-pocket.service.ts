import { User } from '@/core/dto/user';
import { CreateSpendingPocket, SpendingPocketSelect } from './spending-pocket.schema';
import { spendingPockets } from 'db/schemas/spending-pockets';
import { Wallet } from '@/api/wallets/wallet.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Drizzle } from 'db';
import { PocketSelect } from '../pocket.schema';
import { pockets } from 'db/schemas/pockets';

export class SpendingPocketService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async create(user: User, payload: CreateSpendingPocket, wallet: Wallet,): Promise<PocketSelect & SpendingPocketSelect> {
    const spendingPocket = await this.db.transaction(async (tx) => {
      const [pocket] = await tx
        .insert(pockets)
        .values({
          ...payload,
          userId: user.uid,
        })
        .returning();

      const [spendingPocket] = await tx
        .insert(spendingPockets)
        .values({
          ...payload,
          walletId: wallet.id,
          pocketId: pocket.id,
          userId: user.uid,
        })
        .returning();

      return {
        ...pocket,
        ...spendingPocket,
      };
    });
    return spendingPocket;
  }
}
