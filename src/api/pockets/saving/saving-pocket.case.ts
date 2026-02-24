import { User } from '@/core/dto/user';
import { CreateSavingPocket } from './saving-pocket.schema';
import { SavingPocket } from './saving-pocket.dto';
import { SavingPocketService } from './saving-pocket.service';
import { Drizzle } from 'db';
import { WalletService } from '@/api/wallets/wallet.service';
import { Wallet } from '@/api/wallets/wallet.dto';

export abstract class CreateSavingPocketCase {
  static async execute(user: User, payload: CreateSavingPocket): Promise<SavingPocket> {
    const drizzle = Drizzle.getInstance();
    const walletService = new WalletService(drizzle);
    const savingPocketService = new SavingPocketService(drizzle);

    const wallet = await walletService.get(user);

    const savingPocket = await savingPocketService.create(user, payload, new Wallet(wallet));
    return new SavingPocket(savingPocket);
  };
}