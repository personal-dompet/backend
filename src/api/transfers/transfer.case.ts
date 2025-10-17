import { Drizzle } from 'db';
import { TransferService } from './transfer.service';
import { PocketTransferFilter, PocketTransferRequest } from './transfer.schema';
import { User } from '@/core/dto/user';
import { PocketTransfer } from './transfer.dto';

export abstract class PocketTransferCase {
  static async execute(request: PocketTransferRequest, user: User): Promise<PocketTransfer> {
    const transferService = new TransferService(Drizzle.getInstance());
    const transfer = await transferService.createPocketTransfer(request, user);
    return new PocketTransfer(transfer);
  }
}

export abstract class ListPocketTransferCase {
  static async execute(request: PocketTransferFilter, user: User): Promise<PocketTransfer[]> {
    const transferService = new TransferService(Drizzle.getInstance());
    const transfers = await transferService.pocketTransfers(request, user);
    return transfers.map((transfer) => new PocketTransfer(transfer));
  }
}
