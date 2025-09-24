import { savingPockets } from 'db/schemas/saving-pockets';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

const savingPocketSelectSchema = createSelectSchema(savingPockets);

export type SavingPocketSelect = z.infer<typeof savingPocketSelectSchema>;
