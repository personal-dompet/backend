import { integer, pgTable } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';
import { transfers } from './transfers';

export const accountTransfers = pgTable('account_transfers', {
  transferId: integer('transfer_id')
    .references(() => transfers.id)
    .primaryKey(),
  sourceId: integer('source_id')
    .references(() => accounts.id)
    .notNull(),
  destinationId: integer('destination_id')
    .references(() => accounts.id)
    .notNull(),
});
