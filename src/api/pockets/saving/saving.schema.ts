import { savingPockets } from 'db/schemas/saving-pockets';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const savingSelectSchema = createSelectSchema(savingPockets);
export const savingInsertSchema = createInsertSchema(savingPockets).pick({
  targetAmount: true,
  targetDate: true,
  targetDescription: true,
});

export type SavingSelect = z.infer<typeof savingSelectSchema>;
export type SavingInsert = z.infer<typeof savingInsertSchema>;