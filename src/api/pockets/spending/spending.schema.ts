import { spendingPockets } from 'db/schemas/spending-pockets';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const spendingSelectSchema = createSelectSchema(spendingPockets);
export const spendingInsertSchema = createInsertSchema(spendingPockets).pick({
  lowBalanceReminder: true,
  lowBalanceThreshold: true,
});

export type SpendingSelect = z.infer<typeof spendingSelectSchema>;
export type SpendingInsert = z.infer<typeof spendingInsertSchema>;