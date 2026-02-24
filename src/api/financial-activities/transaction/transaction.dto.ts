import { AccountSelect } from '@/api/accounts/account.schema';
import { PocketSelect } from '@/api/pockets/pocket.schema';
import { TransactionCategory } from '@/core/constants/transaction-category';
import { TransactionType } from '@/core/constants/transaction-type';
import { TransactionSelect } from './transaction.schema';

export class Transaction {
  id: number;
  date: number;
  type: TransactionType;
  category: TransactionCategory;
  account: AccountSelect;
  pocket: PocketSelect;

  constructor(data: { transaction: TransactionSelect, account: AccountSelect, pocket: PocketSelect }) {
    this.id = data.transaction.id;
    this.date = data.transaction.date;
    this.type = data.transaction.type as TransactionType;
    this.category = data.transaction.category as TransactionCategory;
    this.account = data.account;
    this.pocket = data.pocket;
  };
}