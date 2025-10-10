import { recurringPockets } from 'db/schemas/recurring-pockets';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { createPocketSchema } from '../pocket.schema';

const recurringPocketSelectSchema = createSelectSchema(recurringPockets);
const recurringPocketInsertSchema = createInsertSchema(recurringPockets).pick({
  amount: true,
  dueDate: true,
  productDescription: true,
  productName: true,
});

const createRecurringPocketSchema = createPocketSchema.extend(recurringPocketInsertSchema.shape)

export type RecurringPocketSelect = z.infer<typeof recurringPocketSelectSchema>;

export type CreateRecurringPocket = z.infer<typeof createRecurringPocketSchema>;
