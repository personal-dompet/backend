import { TransactionCategory } from '@/core/constants/transaction-category';
import { TransactionDetailSelect, TransactionSelect } from './transaction.schema';
import { TransactionType } from '@/core/constants/transaction-type';
import { Pocket } from '../pockets/pocket.dto';
import { Account } from '../accounts/account.dto';
import { Timestamp } from '@/core/dto/timestamp';

export class Transaction extends Timestamp {
  id: number;
  amount: number;
  description: string | null;
  type: TransactionType;
  category: TransactionCategory;
  date: number;

  constructor(data: TransactionSelect) {
    super(data);
    this.id = data.id;
    this.amount = data.amount;
    this.description = data.description;
    this.date = data.date;
    this.type = data.type as TransactionType;
    this.category = data.category as TransactionCategory;
  }
}

export class TransactionDetail extends Transaction {
  pocket: Pocket;
  account: Account;

  constructor(data: TransactionDetailSelect) {
    super(data);
    this.pocket = new Pocket(data.pocket);
    this.account = new Account(data.account);
  }
}