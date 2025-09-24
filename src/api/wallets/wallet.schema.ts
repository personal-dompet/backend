import { walletPockets } from 'db/schemas/wallet-pockets';
import { createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import z from 'zod';

const walletSelectSchema = createSelectSchema(walletPockets)
const walletUpdateSchema = createUpdateSchema(walletPockets)

export type WalletSelect = z.infer<typeof walletSelectSchema>;
export type WalletUpdate = z.infer<typeof walletUpdateSchema>;

export const topupWalletSchema = z.object({
  accountId: z.number(),
  amount: z.number(),
  description: z.string().optional().nullable(),
});

export type TopUpWallet = z.infer<typeof topupWalletSchema>;