import { accountSelectSchema } from '@/api/accounts/account.schema';
import { pocketSelectSchema } from '@/api/pockets/pocket.schema';
import { transactions } from 'db/schemas/transactions';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const transactionSelectSchema = createSelectSchema(transactions);
export const transactionInserSchema = createInsertSchema(transactions).omit({
  financialActivityId: true,
  userId: true,
});

export type TransactionSelect = z.infer<typeof transactionSelectSchema>;