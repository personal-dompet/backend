import { Timestamp } from '@/core/dto/timestamp';
import { Pocket } from '../pockets/pocket.dto';
import { PocketTransferDetailSelect, TransferSelect } from './transfer.schema';

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
  sourcePocket: Pocket;
  destinationPocket: Pocket;

  constructor(data: PocketTransferDetailSelect) {
    super(data);
    this.sourcePocket = new Pocket(data.sourcePocket);
    this.destinationPocket = new Pocket(data.destinationPocket);
  }
}