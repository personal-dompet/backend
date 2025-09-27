import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';

export const walletPockets = pgTable('wallet_pockets', {
  pocketId: integer('pocket_id').references(() => pockets.id).primaryKey(),
  userId: varchar('user_id').unique().notNull(),
  availableBalance: integer('available_balance').notNull().default(0),
})
