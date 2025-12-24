import { PocketType } from '@/core/constants/pocket-type';
import { AllPocket, PocketSelect } from './pocket.schema';
import { Timestamp } from '@/core/dto/timestamp';
import { RecurringPocketSelect } from './recurring/recurring-pocket.schema';
import { SavingPocketSelect } from './saving/saving-pocket.schema';
import { SpendingPocketSelect } from './spending/spending-pocket.schema';

export class Pocket extends Timestamp {
  id: number;
  name: string;
  color?: string | null;
  balance: number;
  icon?: string | null;
  priority: number;
  type: PocketType;

  constructor(data: PocketSelect) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.icon = data.icon;
    this.priority = data.priority;
    this.type = data.type as PocketType;
    this.balance = data.balance;
  }
}

// TODO: Move to its file
export class DetailRecurringPocket {
  amount?: number | null;
  billingDate?: number | null;
  productDescription?: string | null;
  productName?: string | null;

  constructor(recurringPocket: RecurringPocketSelect) {
    this.amount = recurringPocket.amount;
    this.billingDate = recurringPocket.billingDate;
    this.productDescription = recurringPocket.productDescription;
    this.productName = recurringPocket.productName;
  }
}

// TODO: Move to its file
export class DetailSavingPocket {
  targetAmount?: number | null;
  targetDescription?: string | null;
  targetDate?: number | null;

  constructor(savingPocket: SavingPocketSelect) {
    this.targetAmount = savingPocket.targetAmount;
    this.targetDescription = savingPocket.targetDescription;
    this.targetDate = savingPocket.targetDate;
  }
}


// TODO: Move to its file
export class DetailSpendingPocket {
  lowBalanceThreshold: number;
  lowBalanceReminder: boolean;

  constructor(spendingPocket: SpendingPocketSelect) {
    this.lowBalanceThreshold = spendingPocket.lowBalanceThreshold;
    this.lowBalanceReminder = spendingPocket.lowBalanceReminder;
  }
}


export class CompletePocket extends Pocket {
  saving?: DetailSavingPocket;
  spending?: DetailSpendingPocket;
  recurring?: DetailRecurringPocket;

  constructor(data: AllPocket) {
    super(data);
    if (data.saving) {
      this.saving = new DetailSavingPocket(data.saving!);
    }
    if (data.spending) {
      this.spending = new DetailSpendingPocket(data.spending!);
    }
    if (data.recurring) {
      this.recurring = new DetailRecurringPocket(data.recurring!);
    }
  }

  static fromList(data: AllPocket[]): CompletePocket[] {
    return data.map((el) => new CompletePocket(el));
  }
}
