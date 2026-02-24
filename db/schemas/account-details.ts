import { index, integer, pgTable, varchar } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const accountDetails = pgTable('account_details', {
  accountId: integer('account_id').references(() => accounts.id).primaryKey(),
  provider: varchar('provider').notNull(),
  accountNumber: varchar('account_number', { length: 32 }),
}, (table) => [
  index('account_detail_account_id_index').on(table.accountId)
]);
