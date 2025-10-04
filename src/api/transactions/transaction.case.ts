import { User } from '@/core/dto/user';
import { TransactionService } from './transaction.service';
import { Drizzle } from 'db';
import { TransactionDetailSelect, TransactionFilter } from './transaction.schema';

export abstract class RecentTransactionCase {
  static async execute(user: User): Promise<TransactionDetailSelect[]> {
    const transactionService = new TransactionService(Drizzle.getInstance());
    const transactions = await transactionService.list(user, {
      page: 1,
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    return transactions;
  }
}

export abstract class TransactionListCase {
  static async execute(user: User, filter: TransactionFilter): Promise<TransactionDetailSelect[]> {
    const transactionService = new TransactionService(Drizzle.getInstance());
    const transactions = await transactionService.list(user, filter);
    return transactions;
  }
}
