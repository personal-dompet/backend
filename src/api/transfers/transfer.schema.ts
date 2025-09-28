import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { transfers } from 'db/schemas/transfers';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';

const transferInsertSchema = createInsertSchema(transfers);
const pocketTransferInsertSchema = createInsertSchema(pocketTransfers);

export const pocketTransferRequestSchema = transferInsertSchema.extend(pocketTransferInsertSchema.shape).omit({
  transferId: true,
})


export type pocketTransferRequest = z.infer<typeof pocketTransferRequestSchema>
