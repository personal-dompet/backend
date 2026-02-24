import { recurringPockets } from 'db/schemas/recurring-pockets';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const recurringSelectSchema = createSelectSchema(recurringPockets);
export const recurringInsertSchema = createInsertSchema(recurringPockets).pick({
  amount: true,
  billingDate: true,
  productDescription: true,
  productName: true,
});

export type RecurringSelect = z.infer<typeof recurringSelectSchema>;
export type RecurringInsert = z.infer<typeof recurringInsertSchema>;