import { recurringPockets } from 'db/schemas/recurring-pockets';
import { createSelectSchema } from 'drizzle-zod';
import z from 'zod';

const recurringPocketSelectSchema = createSelectSchema(recurringPockets);

export type RecurringPocketSelect = z.infer<typeof recurringPocketSelectSchema>;
