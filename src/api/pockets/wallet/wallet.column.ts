import { walletPockets } from 'db/schemas/wallet-pockets';
import { getColumns } from 'drizzle-orm';

export const walletColumns = getColumns(walletPockets);