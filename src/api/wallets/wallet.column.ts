import { walletPockets } from 'db/schemas/wallet-pockets';
import { getTableColumns } from 'drizzle-orm';

export const walletColumns = getTableColumns(walletPockets);