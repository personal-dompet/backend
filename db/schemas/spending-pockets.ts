import { pgTable, integer, boolean, varchar, index } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';

export const spendingPockets = pgTable('spending_pockets', {
  pocketId: integer('pocket_id').references(() => pockets.id).primaryKey(),
  userId: varchar('user_id').notNull(),
  lowBalanceThreshold: integer('low_balance_threshold').notNull().default(0),
  lowBalanceReminder: boolean('low_balance_reminder').notNull().default(false),
}, (table) => [
  index('spending_pocket_id_index').on(table.pocketId),
  index('spending_user_id_index').on(table.userId),
  index('spending_compose_index').on(table.pocketId, table.userId),
]);
