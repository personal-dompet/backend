import { integer, pgTable } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';
import { transfers } from './transfers';

export const accountTransfers = pgTable('account_transfers', {
  transferId: integer('transfer_id').references(() => transfers.id).primaryKey(),
  sourceAccountId: integer('source_account_id').references(() => accounts.id).notNull(),
  destinationAccountId: integer('destination_account_id').references(() => accounts.id).notNull(),
})