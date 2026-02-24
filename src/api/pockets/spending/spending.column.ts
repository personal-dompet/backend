import { spendingPockets } from 'db/schemas/spending-pockets';
import { getColumns } from 'drizzle-orm';

export const spendingPocketColumns = getColumns(spendingPockets);