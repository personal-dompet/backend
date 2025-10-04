import { Drizzle } from 'db';
import { TransferService } from './transfer.service';
import { PocketTransferDetailSelect, PocketTransferFilter, PocketTransferRequest } from './transfer.schema';
import { User } from '@/core/dto/user';

export abstract class PocketTransferCase {
  static async execute(request: PocketTransferRequest, user: User): Promise<PocketTransferDetailSelect> {
    const transferService = new TransferService(Drizzle.getInstance());
    const transferId = await transferService.createPocketTransfer(request, user);
    return transferId;
  }
}

export abstract class ListPocketTransferCase {
  static async execute(request: PocketTransferFilter, user: User): Promise<PocketTransferDetailSelect[]> {
    const transferService = new TransferService(Drizzle.getInstance());
    const transfers = await transferService.pocketTransfers(request, user);
    return transfers;
  }
}
