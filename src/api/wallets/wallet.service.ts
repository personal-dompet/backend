import { walletPockets } from 'db/schemas/wallet-pockets';
import { WalletPocket, WalletSelect, WalletUpdate } from './wallet.schema';
import { pockets } from 'db/schemas/pockets';
import { and, eq, isNull } from 'drizzle-orm';
import { User } from '@/core/dto/user';
import { walletColumns } from './wallet.column';
import { pocketColumns } from '../pockets/pocket.column';
import { PocketSelect } from '../pockets/pocket.schema';
import { POCKET_TYPE } from '@/core/constants/pocket-type';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Drizzle } from 'db';

export class WalletService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async create(user: User): Promise<[WalletSelect, PocketSelect]> {
    const [wallet, pocket] = await this.db.transaction(async (tx) => {
      const [pocket] = await tx
        .insert(pockets)
        .values({
          userId: user.uid,
          name: 'Wallet',
          type: POCKET_TYPE.WALLET,
        })
        .returning();

      const [wallet] = await tx
        .insert(walletPockets)
        .values({
          pocketId: pocket.id,
          userId: pocket.userId,
        })
        .onConflictDoUpdate({ target: walletPockets.pocketId, set: { pocketId: pocket.id } })
        .returning();

      return [wallet, pocket];
    })
    return [wallet, pocket]
  }

  async get(user: User): Promise<WalletPocket> {
    const [wallet] = await this.db
      .select({
        ...walletColumns,
        ...pocketColumns,
      })
      .from(walletPockets)
      .innerJoin(pockets, eq(walletPockets.pocketId, pockets.id))
      .where(and(eq(pockets.userId, user.uid), isNull(pockets.deletedAt)))
      .limit(1);

    return wallet;
  }

  async update(pocket: PocketSelect, updates: WalletUpdate): Promise<WalletSelect> {
    try {
      const [wallet] = await this.db
        .update(walletPockets)
        .set(updates)
        .where(eq(walletPockets.pocketId, pocket.id))
        .returning();

      return wallet;
    } catch (error) {
      console.error('Error updating wallet:', error);
      throw error;
    }
  }
}
