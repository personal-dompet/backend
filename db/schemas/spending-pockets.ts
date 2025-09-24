import { pgTable, integer, boolean, varchar } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';
import { walletPockets } from './wallet-pockets';

export const spendingPockets = pgTable('spending_pockets', {
  pocketId: integer('pocket_id').references(() => pockets.id).primaryKey(),
  userId: varchar('user_id').notNull(),
  walletId: integer('wallet_id').references(() => walletPockets.pocketId).notNull(),
  balance: integer('balance').notNull().default(0),
  lowBalanceThreshold: integer('low_balance_threshold').notNull().default(0),
  lowBalanceReminder: boolean('low_balance_reminder').notNull().default(false),
})