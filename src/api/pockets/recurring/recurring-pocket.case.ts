import { User } from '@/core/dto/user';
import { CreateRecurringPocket } from './recurring-pocket.schema';
import { RecurringPocket } from './recurring-pocket.dto';
import { RecurringPocketService } from './recurring-pocket.service';
import { Drizzle } from 'db';
import { WalletService } from '@/api/wallets/wallet.service';
import { Wallet } from '@/api/wallets/wallet.dto';

export abstract class CreateRecurringPocketCase {
  static async execute(user: User, payload: CreateRecurringPocket): Promise<RecurringPocket> {
    const drizzle = Drizzle.getInstance();
    const walletService = new WalletService(drizzle);
    const recurringPocketService = new RecurringPocketService(drizzle);

    const wallet = await walletService.get(user);

    const recurringPocket = await recurringPocketService.create(user, payload, new Wallet(wallet));
    return new RecurringPocket(recurringPocket);
  };
}