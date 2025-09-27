import { User } from '@/core/entities/user-entity';
import { TransactionService } from './transaction.service';
import { Drizzle } from 'db';

export abstract class RecentTransactionCase {
  static async execute(user: User) {
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
