import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';
import { timestamps } from './timestamps.helper';
import { accounts } from './accounts';


export const transactions = pgTable('transactions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  accountId: integer('account_id').references(() => accounts.id).notNull(),
  pocketId: integer('pocket_id').references(() => pockets.id).notNull(),
  amount: integer('amount').notNull(),
  description: varchar('description'),
  date: integer('date').notNull(),
  type: varchar('type').notNull(),
  category: varchar('category').notNull(),
  ...timestamps,
})