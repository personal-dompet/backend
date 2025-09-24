import { spendingPockets } from 'db/schemas/spending-pockets';
import { getTableColumns } from 'drizzle-orm';

export const spendingPocketColumns = getTableColumns(spendingPockets);