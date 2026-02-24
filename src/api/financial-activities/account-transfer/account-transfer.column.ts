import { accountTransfers } from 'db/schemas/account-transfers';
import { getColumns } from 'drizzle-orm';

export const accountTransferColumns = getColumns(accountTransfers);