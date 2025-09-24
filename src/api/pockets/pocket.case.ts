import { User } from '@/utils/entities/user-entity';
import { SimplePocket } from './pocket.dto';
import { PocketService } from './pocket.service';
import { CreatePocketRequest, PocketFilter } from './pocket.schema';
import { WalletService } from '../wallets/wallet.service';

export abstract class ListPocketCase {
  static async execute(user: User, query?: PocketFilter): Promise<SimplePocket[]> {
    const pockets = await PocketService.list(user, query);
    return pockets.map((pocket) => new SimplePocket(pocket));
  };
}

export abstract class CreatePocketCase {
  static async execute(user: User, data: CreatePocketRequest): Promise<SimplePocket> {
    const wallet = await WalletService.get(user);
    const pocket = await PocketService.create(user, data, wallet);
    return new SimplePocket(pocket);
  }
}