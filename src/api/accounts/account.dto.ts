import { AccountType } from '@/utils/constants/account-type';
import { AccountSelect } from './account.schema';

export class Account {
  id: number;
  userId: string;
  name: string;
  balance: number;
  color?: string | null;
  type: AccountType;
  createdAt: number;
  updatedAt: number | null;

  constructor(data: Account) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.balance = data.balance;
    this.color = data.color;
    this.type = data.type as AccountType;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class SimpleAccount {
  id: number;
  name: string;
  balance: number;
  color?: string | null;
  type: AccountType;

  constructor(data: AccountSelect) {
    this.id = data.id;
    this.name = data.name;
    this.balance = data.balance;
    this.color = data.color;
    this.type = data.type as AccountType;
  }
}