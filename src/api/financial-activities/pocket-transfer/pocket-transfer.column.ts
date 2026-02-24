import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { getColumns } from 'drizzle-orm';

export const pocketTransferColumns = getColumns(pocketTransfers);