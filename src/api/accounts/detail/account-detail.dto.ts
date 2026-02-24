import { Account } from '../account.dto';
import { AccountSelect } from '../account.schema';
import { AccountDetailSelect } from './account-detail.schema';

export class AccountDetail extends Account {
  provider?: string | null;
  accountNumber?: string | null;

  constructor(detail: AccountSelect & AccountDetailSelect) {
    super(detail);
    this.accountNumber = detail.accountNumber;
    this.provider = detail.provider;
  }
}