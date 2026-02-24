import { pgTable, integer, varchar, index } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';

export const walletPockets = pgTable('wallet_pockets', {
  pocketId: integer('pocket_id').references(() => pockets.id).primaryKey(),
  userId: varchar('user_id').unique().notNull(),
  totalBalance: integer('total_balance').notNull().default(0),
}, (table) => [
  index('wallet_pocket_id_index').on(table.pocketId),
  index('wallet_user_id_index').on(table.userId),
  index('wallet_compose_index').on(table.pocketId, table.userId),
]);
