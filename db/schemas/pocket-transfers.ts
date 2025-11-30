import { integer, pgTable } from 'drizzle-orm/pg-core';
import { transfers } from './transfers';
import { pockets } from './pockets';

export const pocketTransfers = pgTable('pocket_transfers', {
  transferId: integer('transfer_id')
    .references(() => transfers.id)
    .primaryKey(),
  sourceId: integer('source_id')
    .references(() => pockets.id)
    .notNull(),
  destinationId: integer('destination_id')
    .references(() => pockets.id)
    .notNull(),
});
