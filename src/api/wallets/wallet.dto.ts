import { PocketType } from '@/core/constants/pocket-type';

export class Wallet {
  id: number;
  userId: string;
  totalBalance: number;
  balance: number;
  name: string;
  type: PocketType;
  createdAt: number;
  updatedAt: number | null;

  constructor(data: Wallet) {
    this.id = data.id;
    this.userId = data.userId;
    this.totalBalance = data.totalBalance;
    this.balance = data.balance;
    this.name = data.name;
    this.type = data.type;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
