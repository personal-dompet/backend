import { recurringPockets } from 'db/schemas/recurring-pockets';
import { getTableColumns } from 'drizzle-orm';

export const recurringPocketColumns = getTableColumns(recurringPockets);