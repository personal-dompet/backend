import { User } from '@/core/dto/user';
import { CreateSavingPocket, SavingPocketSelect } from './saving-pocket.schema';
import { savingPockets } from 'db/schemas/saving-pockets';
import { Wallet } from '@/api/wallets/wallet.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Drizzle } from 'db';
import { PocketSelect } from '../pocket.schema';
import { pockets } from 'db/schemas/pockets';

export class SavingPocketService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async create(user: User, payload: CreateSavingPocket, wallet: Wallet): Promise<PocketSelect & SavingPocketSelect> {
    const savingPocket = await this.db.transaction(async (tx) => {
      const [pocket] = await tx
        .insert(pockets)
        .values({
          ...payload,
          userId: user.uid,
        })
        .returning();

      const [savingPocket] = await tx
        .insert(savingPockets)
        .values({
          ...payload,
          walletId: wallet.id,
          pocketId: pocket.id,
          userId: user.uid,
        })
        .returning();

      return {
        ...pocket,
        ...savingPocket,
      };
    });
    return savingPocket;
  }
}
