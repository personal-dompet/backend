import { spendingPockets } from 'db/schemas/spending-pockets';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { pocketInsertSchema } from '../pocket.schema';

const spendingPocketInsertSchema = createInsertSchema(spendingPockets).pick({
  balance: true,
  lowBalanceThreshold: true,
  lowBalanceReminder: true,
});

const spendingPocketSelectSchema = createSelectSchema(spendingPockets);

export const createSpendingPocketSchema = spendingPocketInsertSchema.extend(pocketInsertSchema.shape);

export type SpendingPocketInsert = z.infer<typeof spendingPocketInsertSchema>;
export type SpendingPocketSelect = z.infer<typeof spendingPocketSelectSchema>;
export type CreateSpendingPocket = z.infer<typeof createSpendingPocketSchema>;
