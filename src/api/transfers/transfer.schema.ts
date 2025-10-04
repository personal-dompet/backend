import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { transfers } from 'db/schemas/transfers';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { PocketSelect } from '../pockets/pocket.schema';

const transferInsertSchema = createInsertSchema(transfers);
const pocketTransferInsertSchema = createInsertSchema(pocketTransfers);
const transferSelectSchema = createSelectSchema(transfers);
const pocketTransferSelectSchema = createSelectSchema(pocketTransfers);

export const pocketTransferRequestSchema = transferInsertSchema.extend(pocketTransferInsertSchema.shape).omit({
  transferId: true,
  userId: true,
});

export const pocketTransferFilterSchema = z.object({
  // Pagination - page is mandatory as requested
  page: z.string().transform((value) => parseInt(value)),
  limit: z.string().transform((value) => parseInt(value)).default(20),

  sourcePocketId: z.string().transform((value) => parseInt(value)).optional(),
  destinationPocketId: z.string().transform((value) => parseInt(value)).optional(),

  // Amount range filter
  minAmount: z.string().transform((value) => parseInt(value)).optional(), 
  maxAmount: z.string().transform((value) => parseInt(value)).optional(),

  // Date range filter (Unix timestamps)
  startDate: z.string().transform((value) => parseInt(value)).optional(), 
  endDate: z.string().transform((value) => parseInt(value)).optional(),
  startCreatedAt: z.string().transform((value) => parseInt(value)).optional(),
  endCreatedAt: z.string().transform((value) => parseInt(value)).optional(),

  // Search in description
  search: z.string().optional(),

  // Sorting options
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PocketTransferRequest = z.infer<typeof pocketTransferRequestSchema>;
export type PocketTransferFilter = z.infer<typeof pocketTransferFilterSchema>;
export type TransferSelect = z.infer<typeof transferSelectSchema>;
export type PocketTransferSelect = z.infer<typeof pocketTransferSelectSchema>;

export type PocketTransferDetailSelect = TransferSelect & PocketTransferSelect & {
  sourcePocket: PocketSelect;
  destinationPocket: PocketSelect;
}
