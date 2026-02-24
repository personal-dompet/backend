import { transactions } from 'db/schemas/transactions';
import { getColumns } from 'drizzle-orm';

export const transactionColumns = getColumns(transactions);