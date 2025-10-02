import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { transfers } from 'db/schemas/transfers';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

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
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100).default(20),

  sourcePocketId: z.number().int().optional(),
  destinationPocketId: z.number().int().optional(),

  // Amount range filter
  minAmount: z.number().int().optional(),
  maxAmount: z.number().int().optional(),

  // Date range filter (Unix timestamps)
  startDate: z.number().int().optional(),
  endDate: z.number().int().optional(),
  startCreatedAt: z.number().int().optional(),
  endCreatedAt: z.number().int().optional(),

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