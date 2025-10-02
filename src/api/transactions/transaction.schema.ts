import { TRANSACTION_CATEGORY } from '@/core/constants/transaction-category';
import { TRANSACTION_TYPE } from '@/core/constants/transaction-type';
import { transactions } from 'db/schemas/transactions';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { PocketSelect } from '../pockets/pocket.schema';
import { AccountSelect } from '../accounts/account.schema';

const transactionInsertSchema = createInsertSchema(transactions)
const transactionSelectSchema = createSelectSchema(transactions)

export const transactionFilterSchema = z.object({
  // Pagination - page is mandatory as requested
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100).default(20),

  // Pocket filter
  pocketId: z.number().optional(),

  // Amount range filter
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),

  // Date range filter (Unix timestamps)
  startDate: z.number().optional(),
  endDate: z.number().optional(),

  startCreatedAt: z.number().optional(),
  endCreatedAt: z.number().optional(),

  // Type and category filters
  type: z.enum(TRANSACTION_TYPE).optional(),
  category: z.enum(TRANSACTION_CATEGORY).optional(),

  // Search in description
  search: z.string().optional(),

  // Sorting options
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type TransactionInsert = z.infer<typeof transactionInsertSchema>
export type TransactionSelect = z.infer<typeof transactionSelectSchema>
export type TransactionFilter = z.infer<typeof transactionFilterSchema>

export type TransactionDetailSelect = TransactionSelect & {
  pocket?: PocketSelect | null;
  account?: AccountSelect | null;
}