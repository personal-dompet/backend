import { pockets } from 'db/schemas/pockets';
import { getTableColumns } from 'drizzle-orm';

export const pocketColumns = getTableColumns(pockets);