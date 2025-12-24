import { savingPockets } from 'db/schemas/saving-pockets';
import { getTableColumns } from 'drizzle-orm';

export const savingPocketColumns = getTableColumns(savingPockets);