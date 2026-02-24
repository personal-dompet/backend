import { FINANCIAL_ACTIVITY_TYPE, FinancialActivityType } from '@/core/constants/financial-activity-type';
import { AccountTransfer } from './account-transfer/account-transfer.dto';
import { FinancialActivitySelect } from './financial-activity.schema';
import { PocketTransfer } from './pocket-transfer/pocket-transfer.dto';
import { Transaction } from './transaction/transaction.dto';

export class FinancialActivity {
  createdAt: number;
  updatedAt: number | null;
  deletedAt: number | null;
  id: number;
  userId: string;
  amount: number;
  description: string | null;
  type: FinancialActivityType;
  transaction?: Transaction;
  accountTransfer?: AccountTransfer;
  pocketTransfer?: PocketTransfer;

  constructor(data: FinancialActivitySelect) {
    this.amount = data.amount;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.description = data.description;
    this.id = data.id;
    this.type = data.type as FinancialActivityType;
    this.updatedAt = data.updatedAt;
    this.userId = data.userId;

    if (data.type === FINANCIAL_ACTIVITY_TYPE.TRANSACTION && data.account && data.pocket && data.transaction) {
      this.transaction = new Transaction({
        account: data.account,
        pocket: data.pocket,
        transaction: data.transaction,
      })
      return;
    }

    if (data.type === FINANCIAL_ACTIVITY_TYPE.ACCOUNT_TRANSFER && data.sourceAccount && data.destinationAccount && data.accountTransfer) {
      this.accountTransfer = new AccountTransfer({
        sourceAccount: data.sourceAccount,
        destinationAccount: data.destinationAccount,
        accountTransfer: data.accountTransfer,
      })
      return;
    }

    if (data.type === FINANCIAL_ACTIVITY_TYPE.POCKET_TRANSFER && data.sourcePocket && data.destinationPocket && data.pocketTransfer) {
      this.pocketTransfer = new PocketTransfer({
        sourcePocket: data.sourcePocket,
        destinationPocket: data.destinationPocket,
        pocketTransfer: data.pocketTransfer,
      })
      return;
    }
  }

  static fromList(list: FinancialActivitySelect[]): FinancialActivity[] {
    return list.map((data) => new FinancialActivity(data));
  }
}