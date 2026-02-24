import { walletPockets } from 'db/schemas/wallet-pockets';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

export const walletSelectSchema = createSelectSchema(walletPockets);

export type WalletSelect = z.infer<typeof walletSelectSchema>;