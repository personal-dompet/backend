import { pockets } from 'db/schemas/pockets';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { SavingPocketSelect } from './saving/saving-pocket.schema';
import { RecurringPocketSelect } from './recurring/recurring-pocket.schema';
import { SpendingPocketSelect } from './spending/spending-pocket.schema';
import { POCKET_TYPE } from '@/core/constants/pocket-type';

const pocketSelectSchema = createSelectSchema(pockets);
export const pocketInsertSchema = createInsertSchema(pockets).omit({
  userId: true,
});

export const pocketFilterSchema = z.object({
  type: z.enum(POCKET_TYPE).optional().nullable(),
  keyword: z.string().optional().nullable(),
});

export const createPocketSchema = z.object({
  name: z.string().min(1),
  type: z.enum(POCKET_TYPE),
  icon: z.string(),
  color: z.string(),
});

export const detailPocketParamSchema = z.object({
  id: z.string(),
})

export type PocketSelect = z.infer<typeof pocketSelectSchema>;
export type PocketInsert = z.infer<typeof pocketInsertSchema>;

export type PocketFilter = z.infer<typeof pocketFilterSchema>;
export type CreatePocketRequest = z.infer<typeof createPocketSchema>;

export type AllPocket = PocketSelect & {
  saving?: SavingPocketSelect | null;
  recurring?: RecurringPocketSelect | null;
  spending?: SpendingPocketSelect | null;
};

export type DetailPocketParam = z.infer<typeof detailPocketParamSchema>;

export type SavingPocketDetailSelect = PocketSelect & SavingPocketSelect;
export type SpendingPocketDetailSelect = PocketSelect & SpendingPocketSelect;
export type RecurringPocketDetailSelect = PocketSelect & RecurringPocketSelect;
