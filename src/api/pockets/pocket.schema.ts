import { pockets } from 'db/schemas/pockets';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { walletSelectSchema } from './wallet/wallet.schema';
import { recurringInsertSchema, recurringSelectSchema } from './recurring/recurring.schema';
import { savingInsertSchema, savingSelectSchema } from './saving/saving.schema';
import { spendingInsertSchema, spendingSelectSchema } from './spending/spending.schema';

const _pocketSelectSchema = createSelectSchema(pockets);
const _pocketInsertSchema = createInsertSchema(pockets).omit({
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
  userId: true,
});

export const pocketSelectSchema = _pocketSelectSchema.extend({
  wallet: walletSelectSchema.optional().nullable(),
  recurring: recurringSelectSchema.optional().nullable(),
  saving: savingSelectSchema.optional().nullable(),
  spending: spendingSelectSchema.optional().nullable(),
})
export const pocketInsertSchema = _pocketInsertSchema.extend({
  ...recurringInsertSchema.shape,
  ...savingInsertSchema.shape,
  ...spendingInsertSchema.shape,
})

export type PocketSelect = z.infer<typeof pocketSelectSchema>;
export type PocketInsert = z.infer<typeof pocketInsertSchema>;
