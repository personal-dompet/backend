export class SpendingPocket {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  priority: number;
  balance: number;
  lowBalanceThreshold: number;
  lowBalanceReminder: boolean;

  constructor(spendingPocket: SpendingPocket) {
    this.id = spendingPocket.id;
    this.name = spendingPocket.name;
    this.description = spendingPocket.description;
    this.color = spendingPocket.color;
    this.icon = spendingPocket.icon;
    this.priority = spendingPocket.priority;
    this.balance = spendingPocket.balance;
    this.lowBalanceThreshold = spendingPocket.lowBalanceThreshold;
    this.lowBalanceReminder = spendingPocket.lowBalanceReminder;
  }
}