import { accountTransfers } from 'db/schemas/account-transfers';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const accountTransferSelectSchema = createSelectSchema(accountTransfers);
export const accountTransferInsertSchema = createInsertSchema(accountTransfers).omit({
  financialActivityId: true,
  userId: true,
});

export type AccountTransferSelect = z.infer<typeof accountTransferSelectSchema>;