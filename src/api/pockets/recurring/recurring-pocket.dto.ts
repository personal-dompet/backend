import { Pocket } from "../pocket.dto";
import { PocketSelect } from "../pocket.schema";
import { RecurringPocketSelect } from "./recurring-pocket.schema";

export class RecurringPocket extends Pocket {
  amount?: number | null;
  billingDate?: number | null;
  productDescription?: string | null;
  productName?: string | null;

  constructor(recurringPocket: PocketSelect & RecurringPocketSelect) {
    super(recurringPocket);
    this.amount = recurringPocket.amount;
    this.billingDate = recurringPocket.billingDate;
    this.productDescription = recurringPocket.productDescription;
    this.productName = recurringPocket.productName;
  }
}
