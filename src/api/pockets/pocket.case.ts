import { User } from '@/core/entities/user-entity';
import { PocketService } from './pocket.service';
import { CreatePocketRequest, PocketFilter } from './pocket.schema';
import { WalletService } from '../wallets/wallet.service';
import { Drizzle } from 'db';
import { POCKET_TYPE } from '@/core/constants/pocket-type';
import { Pocket } from './pocket.dto';

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
