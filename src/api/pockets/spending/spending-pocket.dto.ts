import { Pocket } from '../pocket.dto';
import { PocketSelect } from '../pocket.schema';
import { SpendingPocketSelect } from './spending-pocket.schema';

export class SpendingPocket extends Pocket {
  lowBalanceThreshold: number;
  lowBalanceReminder: boolean;

  constructor(spendingPocket: PocketSelect & SpendingPocketSelect) {
    super(spendingPocket);
    this.lowBalanceThreshold = spendingPocket.lowBalanceThreshold;
    this.lowBalanceReminder = spendingPocket.lowBalanceReminder;
  }
}