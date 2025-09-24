import { transactions } from 'db/schemas/transactions';
import { getTableColumns } from 'drizzle-orm';

export const transactionColumns = getTableColumns(transactions);