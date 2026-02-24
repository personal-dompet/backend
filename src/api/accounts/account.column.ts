import { accountDetails } from 'db/schemas/account-details';
import { accounts } from 'db/schemas/accounts';
import { getColumns } from 'drizzle-orm';

export const accountColumns = getColumns(accounts);
export const accountDetailColumns = getColumns(accountDetails);
