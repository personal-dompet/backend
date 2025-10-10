import { Pocket } from '../pocket.dto';
import { PocketSelect } from '../pocket.schema';
import { RecurringPocketSelect } from './recurring-pocket.schema';

export class RecurringPocket extends Pocket {
  amount: number;
  dueDate?: number | null;
  productDescription?: string | null;
  productName: string;

  constructor(recurringPocket: PocketSelect & RecurringPocketSelect) {
    super(recurringPocket);
    this.amount = recurringPocket.amount;
    this.dueDate = recurringPocket.dueDate;
    this.productDescription = recurringPocket.productDescription;
    this.productName = recurringPocket.productName;
  }
}