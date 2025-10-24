import { User } from '@/core/dto/user';
import { Drizzle } from 'db';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CreateAccountDetail, AccountDetailSelect } from './account-detail.schema';
import { AccountSelect } from '../account.schema';
import { accounts } from 'db/schemas/accounts';
import { accountDetails } from 'db/schemas/account-details';

export class AccountDetailService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async create(user: User, payload: CreateAccountDetail): Promise<AccountSelect & AccountDetailSelect> {
    const accountDetail = await this.db.transaction(async (tx) => {
      const [account] = await tx
        .insert(accounts)
        .values({
          ...payload,
          userId: user.uid,
        })
        .returning();

      const [detail] = await tx
        .insert(accountDetails)
        .values({
          ...payload,
          accountId: account.id
        })
        .returning();

      return {
        ...account,
        ...detail
      }
    })

    return accountDetail;
  }
}