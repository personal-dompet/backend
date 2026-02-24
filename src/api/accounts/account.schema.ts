import { accountDetails } from 'db/schemas/account-details';
import { accounts } from 'db/schemas/accounts';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

const _accountSelectSchema = createSelectSchema(accounts);
const accountDetailSelectSchema = createSelectSchema(accountDetails);

export const accountSelectSchema = _accountSelectSchema.extend({
  detail: accountDetailSelectSchema.optional().nullable(),
})

const _accountInsertSchema = createInsertSchema(accounts).omit({
  createdAt: true,
  deletedAt: true,
  updatedAt: true,
  userId: true,
});
const _accountDetailInsertSchema = createInsertSchema(accountDetails).omit({
  accountId: true,
}).extend({
  provider: z.string().optional().nullable(),
});

export const accountInsertSchema = _accountInsertSchema.extend({
  ..._accountDetailInsertSchema.shape,
});

export type AccountSelect = z.infer<typeof accountSelectSchema>;
export type AccountInsert = z.infer<typeof accountInsertSchema>;
