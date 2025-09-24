import { accounts } from 'db/schemas/accounts';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';
import { ACCOUNT_TYPE } from '@/utils/constants/account-type';

const accountSelectSchema = createSelectSchema(accounts);
export const accountInsertSchema = createInsertSchema(accounts).omit({
  userId: true,
});

export const accountFilterSchema = z.object({
  type: z.enum(ACCOUNT_TYPE).optional().nullable(),
  keyword: z.string().optional().nullable(),
});

export const createAccountSchema = accountInsertSchema.extend({
  name: z.string().min(1),
  type: z.enum(ACCOUNT_TYPE),
  balance: z.number().int().min(0).default(0),
});

export type AccountSelect = z.infer<typeof accountSelectSchema>;
export type AccountInsert = z.infer<typeof accountInsertSchema>;

export type AccountFilter = z.infer<typeof accountFilterSchema>;
export type CreateAccountRequest = z.infer<typeof createAccountSchema>;