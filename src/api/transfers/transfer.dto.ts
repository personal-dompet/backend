import { Timestamp } from '@/core/dto/timestamp';
import { Pocket } from '../pockets/pocket.dto';
import {
  AccountTransferDetailSelect,
  PocketTransferDetailSelect,
  TransferSelect,
} from './transfer.schema';
import { Account } from '../accounts/account.dto';

export class Transfer extends Timestamp {
  id: number;
  amount: number;
  description?: string | null;

  constructor(data: TransferSelect) {
    super(data);
    this.id = data.id;
    this.amount = data.amount;
    this.description = data.description;
  }
}

export class PocketTransfer extends Transfer {
  source: Pocket;
  destination: Pocket;

  constructor(data: PocketTransferDetailSelect) {
    super(data);
    this.source = new Pocket(data.source);
    this.destination = new Pocket(data.destination);
  }
}

export class AccountTransfer extends Transfer {
  source: Account;
  destination: Account;

  constructor(data: AccountTransferDetailSelect) {
    super(data);
    this.source = new Account(data.source);
    this.destination = new Account(data.destination);
  }
}
