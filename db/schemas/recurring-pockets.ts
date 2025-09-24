import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';
import { walletPockets } from './wallet-pockets';

export const recurringPockets = pgTable('recurring_pockets', {
  pocketId: integer('pocket_id').references(() => pockets.id).primaryKey(),
  userId: varchar('user_id').notNull(),
  walletId: integer('wallet_id').references(() => walletPockets.pocketId).notNull(),
  balance: integer('balance').notNull().default(0),
  productName: varchar('product_name'),
  productDescription: varchar('product_description'),
  dueDate: integer('due_date'), // 1-31. represent date of next payment
  amount: integer('amount'),
})