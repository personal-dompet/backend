import { AccountType } from '@/core/constants/account-type';
import { AccountSelect } from './account.schema';
import { Timestamp } from '@/core/dto/timestamp';

export class Account extends Timestamp {
  id: number;
  name: string;
  balance: number;
  color?: string | null;
  type: AccountType;

  constructor(data: AccountSelect) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.balance = data.balance;
    this.color = data.color;
    this.type = data.type as AccountType;
  }
}