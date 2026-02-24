import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { pockets } from './pockets';
import { financialActivities } from './financial-activities';

export const pocketTransfers = pgTable('pocket_transfers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  financialActivityId: integer('financial_activity_id').references(() => financialActivities.id).notNull(),
  sourceId: integer('source_id')
    .references(() => pockets.id)
    .notNull(),
  destinationId: integer('destination_id')
    .references(() => pockets.id)
    .notNull(),
}, (table) => [
  index('pocket_transfer_user_id_index').on(table.userId),
  index('pocket_transfer_financial_activity_id_index').on(table.financialActivityId),
  index('pocket_transfer_source_id_index').on(table.sourceId),
  index('pocket_transfer_destination_id_index').on(table.destinationId),
]);

