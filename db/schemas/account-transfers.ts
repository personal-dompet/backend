import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';
import { financialActivities } from './financial-activities';

export const accountTransfers = pgTable('account_transfers', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar('user_id').notNull(),
  financialActivityId: integer('financial_activity_id').references(() => financialActivities.id).notNull(),
  sourceId: integer('source_id')
    .references(() => accounts.id)
    .notNull(),
  destinationId: integer('destination_id')
    .references(() => accounts.id)
    .notNull(),
}, (table) => [
  index('account_transfer_user_id_index').on(table.userId),
  index('account_transfer_financial_activity_id_index').on(table.financialActivityId),
  index('account_transfer_source_id_index').on(table.sourceId),
  index('account_transfer_destination_id_index').on(table.destinationId),
]);
