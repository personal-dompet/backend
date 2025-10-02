import { TransactionCategory } from '@/core/constants/transaction-category';
import { TransactionDetailSelect, TransactionSelect } from './transaction.schema';
import { TransactionType } from '@/core/constants/transaction-type';
import { Pocket } from '../pockets/pocket.dto';
import { Account } from '../accounts/account.dto';

export class Transaction {
  id: number;
  amount: number;
  description: string | null;
  type: TransactionType;
  category: TransactionCategory;
  date: number;
  createdAt: number;

  constructor(data: TransactionSelect) {
    this.id = data.id;
    this.amount = data.amount;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.date = data.date;
    this.type = data.type as TransactionType;
    this.category = data.category as TransactionCategory;
  }
}

export class TransactionDetail extends Transaction {
  pocket?: Pocket | null;
  account?: Account | null;

  constructor(data: TransactionDetailSelect) {
    super(data);
    this.pocket = data.pocket ? new Pocket(data.pocket) : null;
    this.account = data.account ? new Account(data.account) : null;
  }
}