import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';
import { walletPockets } from './wallet-pockets';

export const savingPockets = pgTable('saving_pockets', {
  pocketId: integer('pocket_id').references(() => pockets.id).primaryKey(),
  userId: varchar('user_id').notNull(),
  walletId: integer('wallet_id').references(() => walletPockets.pocketId).notNull(),
  targetAmount: integer('target_amount'),
  targetDescription: varchar('target_description'),
  targetDate: integer('target_date'),
})
