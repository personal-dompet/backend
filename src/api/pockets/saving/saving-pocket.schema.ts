import { savingPockets } from 'db/schemas/saving-pockets';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { createPocketSchema } from '../pocket.schema';

const savingPocketSelectSchema = createSelectSchema(savingPockets);
const savingPocketInsertSchema = createInsertSchema(savingPockets).pick({
  targetAmount: true,
  targetDescription: true,
  targetDate: true,
});

export const createSavingPocketSchema = createPocketSchema.extend(savingPocketInsertSchema.shape)

export type SavingPocketSelect = z.infer<typeof savingPocketSelectSchema>;

export type CreateSavingPocket = z.infer<typeof createSavingPocketSchema>;
