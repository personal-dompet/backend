import { User } from '@/core/dto/user';
import { PocketService } from './pocket.service';
import { CreatePocketRequest, DetailPocketParam, PocketFilter } from './pocket.schema';
import { WalletService } from '../wallets/wallet.service';
import { Drizzle } from 'db';
import { POCKET_TYPE } from '@/core/constants/pocket-type';
import { Pocket } from './pocket.dto';
import { RecurringPocketService } from './recurring/recurring-pocket.service';
import { RecurringPocket } from './recurring/recurring-pocket.dto';
import { SavingPocket } from './saving/saving-pocket.dto';
import { SavingPocketService } from './saving/saving-pocket.service';
import { SpendingPocket } from './spending/spending-pocket.dto';
import { SpendingPocketService } from './spending/spending-pocket.service';

export abstract class ListPocketCase {
  static async execute(user: User, query?: PocketFilter): Promise<Pocket[]> {
    const pocketService = new PocketService(Drizzle.getInstance());
    const pockets = await pocketService.list(user, query);
    return pockets.map((pocket) => new Pocket(pocket));
  };
}

export abstract class CreatePocketCase {
  static async execute(user: User, data: CreatePocketRequest): Promise<Pocket> {
    const walletService = new WalletService(Drizzle.getInstance());
    const pocketService = new PocketService(Drizzle.getInstance());
    const wallet = await walletService.get(user);
    const pocket = await pocketService.create(user, data, { ...wallet, type: POCKET_TYPE.WALLET });
    return new Pocket(pocket);
  }
}

export abstract class DetailPocketCase {
  static async execute(param: DetailPocketParam): Promise<Pocket> {
    const pocketService = new PocketService(Drizzle.getInstance());
    const pocket = await pocketService.detail(param);
    if (pocket.type == POCKET_TYPE.RECURRING) {
      const recurringPocketService = new RecurringPocketService(Drizzle.getInstance());
      const recurringPocket = await recurringPocketService.detail(pocket.id);
      return new RecurringPocket({
        ...pocket,
        ...recurringPocket,
      });
    }
    if (pocket.type == POCKET_TYPE.SAVING) {
      const savingPocketService = new SavingPocketService(Drizzle.getInstance());
      const savingPocket = await savingPocketService.detail(pocket.id);
      return new SavingPocket({
        ...pocket,
        ...savingPocket,
      });
    }

    const spendingPocketService = new SpendingPocketService(Drizzle.getInstance());
    const spendingPocket = await spendingPocketService.detail(pocket.id);
    return new SpendingPocket({
      ...pocket,
      ...spendingPocket,
    });
  }
}
