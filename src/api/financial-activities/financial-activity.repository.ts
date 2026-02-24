import { AppRepository } from '@/core/lib/app-repository';
import { User } from '@/core/schemas/user';
import { transactionColumns } from './transaction/transaction.column';
import { financialActivitieColumns } from './financial-activity.column';
import { financialActivities } from 'db/schemas/financial-activities';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { transactions } from 'db/schemas/transactions';
import { accountColumns } from '../accounts/account.column';
import { pocketColumns } from '../pockets/pocket.column';
import { accounts } from 'db/schemas/accounts';
import { pockets } from 'db/schemas/pockets';
import { FinancialActivity } from './financial-activity.dto';

export class FinancialActivityReposiory extends AppRepository {
  async recentTransactions(user: User): Promise<FinancialActivity[]> {
    const recentTransactions = await this.db
      .select({
        ...financialActivitieColumns,
        transactions: transactionColumns,
        account: accountColumns,
        pocket: pocketColumns,
      })
      .from(financialActivities)
      .where(and(
        isNull(financialActivities.deletedAt),
        eq(financialActivities.userId, user.uid),
      ))
      .innerJoin(transactions, eq(transactions.financialActivityId, financialActivities.id))
      .innerJoin(accounts, eq(accounts.id, transactions.accountId))
      .innerJoin(pockets, eq(pockets.id, transactions.pocketId))
      .orderBy(desc(financialActivities.createdAt))
      .limit(5);

    return FinancialActivity.fromList(recentTransactions);
  }
}