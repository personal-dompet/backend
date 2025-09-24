import { transactions } from 'db/schemas/transactions';
import { TransactionInsert, TransactionSelect, TransactionFilter } from './transaction.schema';
import { db } from 'db';
import { and, asc, desc, ilike, gte, lte, eq } from 'drizzle-orm';
import { User } from '@/utils/entities/user-entity';

export abstract class TransactionService {
  static async create(payload: TransactionInsert): Promise<TransactionSelect> {
    const [transaction] = await db
      .insert(transactions)
      .values(payload)
      .returning();
    return transaction;
  }

  static async list(user: User, filter: TransactionFilter): Promise<TransactionSelect[]> {
    const {
      page,
      limit = 20,
      pocketId,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      type,
      category,
      search,
      endCreatedAt,
      startCreatedAt,
      sortBy = 'date',
      sortOrder = 'desc'
    } = filter;

    const offset = (page - 1) * limit;

    // Build conditions array for conditional filtering
    const conditions = [
      eq(transactions.userId, user.uid),
      pocketId !== undefined ? eq(transactions.pocketId, pocketId) : undefined,
      minAmount !== undefined ? gte(transactions.amount, minAmount) : undefined,
      maxAmount !== undefined ? lte(transactions.amount, maxAmount) : undefined,
      startDate !== undefined ? gte(transactions.date, startDate) : undefined,
      endDate !== undefined ? lte(transactions.date, endDate) : undefined,
      startCreatedAt !== undefined ? gte(transactions.createdAt, startCreatedAt) : undefined,
      endCreatedAt !== undefined ? lte(transactions.createdAt, endCreatedAt) : undefined,
      type !== undefined ? eq(transactions.type, type) : undefined,
      category !== undefined ? eq(transactions.category, category) : undefined,
      search !== undefined ? ilike(transactions.description, `%${search}%`) : undefined,
    ].filter(condition => condition !== undefined);

    const sortColumn = sortBy === 'date' ? transactions.date :
      sortBy === 'amount' ? transactions.amount :
        transactions.createdAt;

    const result = await db
      .select()
      .from(transactions)
      .where(and(...conditions))
      .orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn))
      .limit(limit).offset(offset);
    return result;
  }
}