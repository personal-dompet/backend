export class Wallet {
  id: number;
  userId: string;
  availableBalance: number;
  balance: number;
  createdAt: number;
  updatedAt: number | null;

  constructor(data: Wallet) {
    this.id = data.id;
    this.userId = data.userId;
    this.availableBalance = data.availableBalance;
    this.balance = data.balance;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}