import { accountDetails } from 'db/schemas/account-details';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { createAccountSchema } from '../account.schema';
import z from 'zod';

const accountDetailSelectSchema = createSelectSchema(accountDetails);
const accountDetailInserSchema = createInsertSchema(accountDetails).pick({
  accountNumber: true,
  provider: true,
});

export const createAccountDetailSchema = createAccountSchema.extend(accountDetailInserSchema.shape)

export type AccountDetailSelect = z.infer<typeof accountDetailSelectSchema>

export type CreateAccountDetail = z.infer<typeof createAccountDetailSchema>