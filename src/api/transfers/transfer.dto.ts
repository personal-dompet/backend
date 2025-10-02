import { Pocket } from '../pockets/pocket.dto';
import { PocketSelect } from '../pockets/pocket.schema';
import { PocketTransferSelect, TransferSelect } from './transfer.schema';

export class PocketTransfer {
  id: number;
  userId: string;
  sourcePocketId: number;
  destinationPocketId: number;
  sourcePocket: Pocket;
  destinationPocket: Pocket;
  amount: number;
  date: number;
  description: string;

  constructor(data: PocketTransferResponse) {
    this.id = data.transfer.id;
    this.userId = data.transfer.userId;
    this.sourcePocketId = data.pocketTransfer.sourcePocketId;
    this.destinationPocketId = data.pocketTransfer.destinationPocketId;
    this.amount = data.transfer.amount;
    this.date = data.transfer.date;
    this.description = data.transfer.description;
    this.sourcePocket = new Pocket(data.sourcePocket);
    this.destinationPocket = new Pocket(data.destinationPocket);
  }
}

export type PocketTransferResponse = {
  transfer: TransferSelect;
  pocketTransfer: PocketTransferSelect;
  sourcePocket: PocketSelect;
  destinationPocket: PocketSelect;
}