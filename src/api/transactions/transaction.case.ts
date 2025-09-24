import { User } from '@/utils/entities/user-entity';
import { TransactionService } from './transaction.service';

export abstract class RecentTransactionCase {
  static async execute(user: User) {
    const transactions = await TransactionService.list(user, {
      page: 1,
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    return transactions;
  }
}