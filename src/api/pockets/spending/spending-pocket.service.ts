import { User } from '@/utils/entities/user-entity';
import { SpendingPocketSelect } from './spending-pocket.schema';
import { Pocket } from '../pocket.dto';
import { db } from 'db';
import { spendingPockets } from 'db/schemas/spending-pockets';
import { Wallet } from '@/api/wallets/wallet.dto';

export abstract class SpendingPocketService {
  static async create(user: User, pocket: Pocket, wallet: Wallet,): Promise<SpendingPocketSelect> {
    const [spendingPocket] = await db
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