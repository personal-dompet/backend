import { integer, pgTable } from 'drizzle-orm/pg-core';
import { transfers } from './transfers';
import { pockets } from './pockets';

export const pocketTransfers = pgTable('pocket_transfers', {
  transferId: integer('transfer_id').references(() => transfers.id).primaryKey(),
  sourcePocketId: integer('source_pocket_id').references(() => pockets.id).notNull(),
  destinationPocketId: integer('destination_pocket_id').references(() => pockets.id).notNull(),
})