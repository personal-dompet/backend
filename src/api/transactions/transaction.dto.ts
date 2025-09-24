export class RecentTransaction {
  amount: number;
  description: string | null;
  createdAt: number;
  type: string;
  category: string;

  constructor(data: RecentTransaction) {
    this.amount = data.amount;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.type = data.type;
    this.category = data.category;
  }
}