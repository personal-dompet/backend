import { User } from '@/core/dto/user';
import { CreateSpendingPocket } from './spending-pocket.schema';
import { SpendingPocket } from './spending-pocket.dto';
import { SpendingPocketService } from './spending-pocket.service';
import { Drizzle } from 'db';
import { WalletService } from '@/api/wallets/wallet.service';
import { Wallet } from '@/api/wallets/wallet.dto';

export abstract class CreateSpendingPocketCase {
  static async execute(user: User, payload: CreateSpendingPocket): Promise<SpendingPocket> {
    const drizzle = Drizzle.getInstance();
    const walletService = new WalletService(drizzle);
    const spendingPocketService = new SpendingPocketService(drizzle);

    const wallet = await walletService.get(user);

    const spendingPocket = await spendingPocketService.create(user, payload, new Wallet(wallet));
    return new SpendingPocket(spendingPocket);
  };
}