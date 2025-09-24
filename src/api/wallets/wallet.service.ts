import { db } from 'db';
import { walletPockets } from 'db/schemas/wallet-pockets';
import { WalletSelect, WalletUpdate } from './wallet.schema';
import { pockets } from 'db/schemas/pockets';
import { and, eq, isNull } from 'drizzle-orm';
import { User } from '@/utils/entities/user-entity';
import { walletColumns } from './wallet.column';
import { pocketColumns } from '../pockets/pocket.column';
import { PocketSelect } from '../pockets/pocket.schema';
import { POCKET_TYPE } from '@/utils/constants/pocket-type';

export abstract class WalletService {
  static async create(user: User): Promise<[WalletSelect, PocketSelect]> {
    const [wallet, pocket] = await db.transaction(async (tx) => {
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

  static async get(user: User): Promise<WalletSelect & PocketSelect> {
    const [wallet] = await db
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

  static async update(pocket: PocketSelect, updates: WalletUpdate): Promise<WalletSelect> {
    try {
      const [wallet] = await db
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