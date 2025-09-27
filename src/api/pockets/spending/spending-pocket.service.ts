import { User } from '@/core/entities/user-entity';
import { SpendingPocketSelect } from './spending-pocket.schema';
import { Pocket } from '../pocket.dto';
import { spendingPockets } from 'db/schemas/spending-pockets';
import { Wallet } from '@/api/wallets/wallet.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Drizzle } from 'db';

export class SpendingPocketService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async create(user: User, pocket: Pocket, wallet: Wallet,): Promise<SpendingPocketSelect> {
    const [spendingPocket] = await this.db
      .insert(spendingPockets)
      .values({
        walletId: wallet.id,
        pocketId: pocket.id,
        userId: user.uid,
        balance: 0,
        lowBalanceReminder: false,
        lowBalanceThreshold: 0,
      }).returning();
    return spendingPocket;
  }
}
