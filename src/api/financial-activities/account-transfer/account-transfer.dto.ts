import { AccountSelect } from '@/api/accounts/account.schema';
import { AccountTransferSelect } from './account-transfer.schema';

export class AccountTransfer {
  id: number;
  sourceAccount: AccountSelect;
  destinationAccount: AccountSelect;

  constructor(data: { accountTransfer: AccountTransferSelect, sourceAccount: AccountSelect, destinationAccount: AccountSelect }) {
    this.id = data.accountTransfer.id;
    this.sourceAccount = data.sourceAccount;
    this.destinationAccount = data.destinationAccount;
  }
}