import { savingPockets } from 'db/schemas/saving-pockets';
import { getColumns } from 'drizzle-orm';

export const savingPocketColumns = getColumns(savingPockets);