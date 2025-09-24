import { accounts } from 'db/schemas/accounts';
import { getTableColumns } from 'drizzle-orm';

export const accountColumns = getTableColumns(accounts);