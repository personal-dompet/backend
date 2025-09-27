import { User } from '@/core/entities/user-entity';
import { SimplePocket } from './pocket.dto';
import { PocketService } from './pocket.service';
import { CreatePocketRequest, PocketFilter } from './pocket.schema';
import { WalletService } from '../wallets/wallet.service';
import { Drizzle } from 'db';

export abstract class ListPocketCase {
  static async execute(user: User, query?: PocketFilter): Promise<SimplePocket[]> {
    const pocketService = new PocketService(Drizzle.getInstance());
    const pockets = await pocketService.list(user, query);
    return pockets.map((pocket) => new SimplePocket(pocket));
  };
}

export abstract class CreatePocketCase {
  static async execute(user: User, data: CreatePocketRequest): Promise<SimplePocket> {
    const walletService = new WalletService(Drizzle.getInstance());
    const pocketService = new PocketService(Drizzle.getInstance());
    const wallet = await walletService.get(user);
    const pocket = await pocketService.create(user, data, wallet);
    return new SimplePocket(pocket);
  }
}
