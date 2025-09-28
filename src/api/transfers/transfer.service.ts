import { Drizzle } from 'db';
import { pocketTransferRequest } from './transfer.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { transfers } from 'db/schemas/transfers';
import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { pockets } from 'db/schemas/pockets';
import { and, eq, isNull } from 'drizzle-orm';

export class TransferService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
      return this.drizzle.db;
    }

  async createPocketTransfer(request: pocketTransferRequest) {
    const { userId, amount, description, date, sourcePocketId, destinationPocketId } = request;
    
    const transferId = await this.db.transaction(async (tx) => {
      const [sourcePocket] = await tx.select().from(pockets).where(and(eq(pockets.id, sourcePocketId), isNull(pockets.deletedAt))).limit(1);
      if (!sourcePocket) {
        throw new Error('Source pocket not found');
      }
      const [destinationPocket] = await tx.select().from(pockets).where(and(eq(pockets.id, destinationPocketId), isNull(pockets.deletedAt))).limit(1);
      if (!destinationPocket) {
        throw new Error('Destination pocket not found');
      }

      const [transfer] = await tx.insert(transfers).values({
        userId,
        amount,
        description,
        date,
      }).returning()

      await tx.insert(pocketTransfers).values({
        transferId: transfer.id,
        sourcePocketId: sourcePocket.id,
        destinationPocketId: destinationPocket.id,
      })

        // Update source pocket balance
        await tx.update(pockets).set({
          balance: sourcePocket.balance - amount,
        }).where(eq(pockets.id, sourcePocket.id));

        // Update destination pocket balance
        await tx.update(pockets).set({
          balance: destinationPocket.balance + amount,
        }).where(eq(pockets.id, destinationPocket.id));

      return transfer.id;
    });

    return transferId;
  }
}
