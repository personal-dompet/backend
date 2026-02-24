import { pockets } from 'db/schemas/pockets';
import { getColumns } from 'drizzle-orm';

export const pocketColumns = getColumns(pockets);
