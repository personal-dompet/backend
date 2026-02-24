import { pgTable, integer, varchar, index } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';

export const savingPockets = pgTable('saving_pockets', {
  pocketId: integer('pocket_id').references(() => pockets.id).primaryKey(),
  userId: varchar('user_id').notNull(),
  targetAmount: integer('target_amount'),
  targetDescription: varchar('target_description'),
  targetDate: integer('target_date'),
}, (table) => [
  index('saving_pocket_id_index').on(table.pocketId),
  index('saving_user_id_index').on(table.userId),
  index('saving_compose_index').on(table.pocketId, table.userId),
]);

