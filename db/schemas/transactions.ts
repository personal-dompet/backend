import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';
import { timestamps } from './timestamps.helper';
import { accounts } from './accounts';
import { TRANSACTION_TYPE } from '@/core/constants/transaction-type';
import { TRANSACTION_CATEGORY } from '@/core/constants/transaction-category';


export const transactions = pgTable('transactions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  accountId: integer('account_id').references(() => accounts.id).notNull(),
  pocketId: integer('pocket_id').references(() => pockets.id).notNull(),
  amount: integer('amount').notNull(),
  description: varchar('description'),
  date: integer('date').notNull(),
  type: varchar('type', { length: 10 }).notNull().default(TRANSACTION_TYPE.EXPENSE),
  category: varchar('category', { length: 50 }).notNull().default(TRANSACTION_CATEGORY.OTHERS),
  ...timestamps,
})