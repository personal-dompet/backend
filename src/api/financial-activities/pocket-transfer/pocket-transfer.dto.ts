import { PocketSelect } from '@/api/pockets/pocket.schema';
import { PocketTransferSelect } from './pocket-transfer.schema';

export class PocketTransfer {
  id: number;
  sourcePocket: PocketSelect;
  destinationPocket: PocketSelect;

  constructor(data: { pocketTransfer: PocketTransferSelect, sourcePocket: PocketSelect, destinationPocket: PocketSelect }) {
    this.id = data.pocketTransfer.id;
    this.sourcePocket = data.sourcePocket;
    this.destinationPocket = data.destinationPocket;
  }
}