import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { timestamps } from './timestamps.helper';

export const transfers = pgTable('transfers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  amount: integer('amount').notNull(),
  description: varchar('description'),
  ...timestamps,
})