import { Drizzle } from 'db';
import { TransferService } from './transfer.service';
import {
  TransferFilter,
  PocketTransferRequest,
  AccountTransferRequest,
} from './transfer.schema';
import { User } from '@/core/dto/user';
import { AccountTransfer, PocketTransfer } from './transfer.dto';

export abstract class PocketTransferCase {
  static async execute(
    request: PocketTransferRequest,
    user: User
  ): Promise<PocketTransfer> {
    const transferService = new TransferService(Drizzle.getInstance());
    const transfer = await transferService.createPocketTransfer(request, user);
    return new PocketTransfer(transfer);
  }
}

export abstract class ListPocketTransferCase {
  static async execute(
    request: TransferFilter,
    user: User
  ): Promise<PocketTransfer[]> {
    const transferService = new TransferService(Drizzle.getInstance());
    const transfers = await transferService.pocketTransfers(request, user);
    return transfers.map((transfer) => new PocketTransfer(transfer));
  }
}

export abstract class AccountTransferCase {
  static async execute(
    request: AccountTransferRequest,
    user: User
  ): Promise<AccountTransferCase> {
    const transferService = new TransferService(Drizzle.getInstance());
    const transfer = await transferService.createAccountTransfer(request, user);
    return new AccountTransfer(transfer);
  }
}

export abstract class ListAccountTransferCase {
  static async execute(
    request: TransferFilter,
    user: User
  ): Promise<AccountTransfer[]> {
    const transferService = new TransferService(Drizzle.getInstance());
    const transfers = await transferService.accountTransfers(request, user);
    return transfers.map((transfer) => new AccountTransfer(transfer));
  }
}
