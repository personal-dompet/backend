import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const pocketTransferSelectSchema = createSelectSchema(pocketTransfers);
export const pocketTransferInsertSchema = createInsertSchema(pocketTransfers).omit({
  financialActivityId: true,
  userId: true,
});

export type PocketTransferSelect = z.infer<typeof pocketTransferSelectSchema>;