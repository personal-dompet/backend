import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { transfers } from 'db/schemas/transfers';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { PocketSelect } from '../pockets/pocket.schema';
import { accountTransfers } from 'db/schemas/account-transfers';
import { AccountSelect } from '../accounts/account.schema';

const transferInsertSchema = createInsertSchema(transfers);
const pocketTransferInsertSchema = createInsertSchema(pocketTransfers);
const accountTransferInsertSchema = createInsertSchema(accountTransfers);
const transferSelectSchema = createSelectSchema(transfers);
const pocketTransferSelectSchema = createSelectSchema(pocketTransfers);
const accountTransferSelectSchema = createSelectSchema(accountTransfers);

export const pocketTransferRequestSchema = transferInsertSchema
  .extend(pocketTransferInsertSchema.shape)
  .omit({
    transferId: true,
    userId: true,
  });

export const accountTransferRequestSchema = transferInsertSchema
  .extend(accountTransferInsertSchema.shape)
  .omit({
    transferId: true,
    userId: true,
  });

export const transferFilterSchema = z.object({
  // Pagination - page is mandatory as requested
  page: z.string().transform((value) => parseInt(value)),
  limit: z
    .string()
    .transform((value) => parseInt(value))
    .default(20),

  sourceId: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  destinationId: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),

  // Amount range filter
  minAmount: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  maxAmount: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),

  // Date range filter (Unix timestamps)
  startDate: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  endDate: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  startCreatedAt: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),
  endCreatedAt: z
    .string()
    .transform((value) => parseInt(value))
    .optional(),

  // Search in description
  search: z.string().optional(),

  // Sorting options
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PocketTransferRequest = z.infer<typeof pocketTransferRequestSchema>;
export type AccountTransferRequest = z.infer<
  typeof accountTransferRequestSchema
>;
export type TransferFilter = z.infer<typeof transferFilterSchema>;
export type TransferSelect = z.infer<typeof transferSelectSchema>;
export type PocketTransferSelect = z.infer<typeof pocketTransferSelectSchema>;
export type AccountTransferSelect = z.infer<typeof accountTransferSelectSchema>;

export type PocketTransferDetailSelect = TransferSelect &
  PocketTransferSelect & {
    source: PocketSelect;
    destination: PocketSelect;
  };

export type AccountTransferDetailSelect = TransferSelect &
  AccountTransferSelect & {
    source: AccountSelect;
    destination: AccountSelect;
  };
