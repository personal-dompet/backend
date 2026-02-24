import { AppRepository } from '@/core/lib/app-repository';
import { AccountInsert, AccountSelect } from './account.schema';
import { accountColumns, accountDetailColumns } from './account.column';
import { accounts } from 'db/schemas/accounts';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { User } from '@/core/schemas/user';
import { accountDetails } from 'db/schemas/account-details';
import { ACCOUNT_TYPE } from '@/core/constants/account-type';

export class AccountRepository extends AppRepository {
  async list(user: User): Promise<AccountSelect[]> {
    const list = await this.db
      .select({
        ...accountColumns,
        detail: accountDetailColumns,
      })
      .from(accounts)
      .where(and(isNull(accounts.deletedAt), eq(accounts.userId, user.uid)))
      .leftJoin(accountDetails, eq(accountDetails.accountId, accounts.id))
      .orderBy(desc(accounts.createdAt))

    return list;
  }

  async create(user: User, payload: AccountInsert): Promise<AccountSelect> {
    const account = await this.db.transaction(async (tx) => {
      const [_account] = await tx.insert(accounts)
        .values({
          ...payload,
          userId: user.uid,
        })
        .returning(accountColumns);

      if (_account.type === ACCOUNT_TYPE.CASH) {
        return _account;
      }

      const [detail] = await tx.insert(accountDetails)
        .values({
          accountId: _account.id,
          provider: payload.provider ?? _account.name,
          accountNumber: payload.accountNumber,
        })

      const result: AccountSelect = {
        ..._account,
        detail,
      }

      return result;
    })

    return account;
  }

  async get(user: User, id: number): Promise<AccountSelect> {
    const [account] = await this.db
      .select(accountColumns)
      .from(accounts)
      .where(and(
        isNull(accounts.deletedAt),
        eq(accounts.id, id),
        eq(accounts.userId, user.uid),
      ))
      .limit(1)

    return account;
  }
}