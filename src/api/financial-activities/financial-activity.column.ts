import { financialActivities } from 'db/schemas/financial-activities';
import { getColumns } from 'drizzle-orm';

export const financialActivitieColumns = getColumns(financialActivities);