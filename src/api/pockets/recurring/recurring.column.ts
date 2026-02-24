import { recurringPockets } from 'db/schemas/recurring-pockets';
import { getColumns } from 'drizzle-orm';

export const recurringPocketColumns = getColumns(recurringPockets);