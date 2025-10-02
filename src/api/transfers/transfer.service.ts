import { Drizzle } from 'db';
import { PocketTransferRequest, PocketTransferFilter, PocketTransferDetailSelect } from './transfer.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { transfers } from 'db/schemas/transfers';
import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { pockets } from 'db/schemas/pockets';
import { and, eq, gte, lte, isNull, ilike, asc, desc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { User } from '@/core/entities/user-entity';

export class TransferService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async createPocketTransfer(request: PocketTransferRequest, user: User): Promise<PocketTransferDetailSelect> {
    const { amount, description, sourcePocketId, destinationPocketId } = request;
    const userId = user.uid;

    const transfer: PocketTransferDetailSelect = await this.db.transaction(async (tx) => {
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
      }).returning()

      const [pocketTransfer] = await tx.insert(pocketTransfers).values({
        transferId: transfer.id,
        sourcePocketId: sourcePocket.id,
        destinationPocketId: destinationPocket.id,
      }).returning()

      // Update source pocket balance
      const [sourcePocketUpdate] = await tx.update(pockets).set({
        balance: sourcePocket.balance - amount,
      }).where(eq(pockets.id, sourcePocket.id)).returning()

      // Update destination pocket balance
      const [destinationPocketUpdate] = await tx.update(pockets).set({
        balance: destinationPocket.balance + amount,
      }).where(eq(pockets.id, destinationPocket.id)).returning()

      return {
        ...transfer,
        ...pocketTransfer,
        sourcePocket: sourcePocketUpdate,
        destinationPocket: destinationPocketUpdate,
      };
    });

    return transfer;
  }

  async pocketTransfers(filter: PocketTransferFilter, user: User): Promise<PocketTransferDetailSelect[]> {
    const {
      page,
      limit = 20,
      sourcePocketId,
      destinationPocketId,
      startDate,
      endDate,
      startCreatedAt,
      endCreatedAt,
      minAmount,
      maxAmount,
      search,
      sortBy = 'date',
      sortOrder = 'desc'
    } = filter;

    const offset = (page - 1) * limit;
    const userId = user.uid;

    // Build conditions array for conditional filtering
    const conditions = [
      userId !== undefined ? eq(transfers.userId, userId) : undefined,
      sourcePocketId !== undefined ? eq(pocketTransfers.sourcePocketId, sourcePocketId) : undefined,
      destinationPocketId !== undefined ? eq(pocketTransfers.destinationPocketId, destinationPocketId) : undefined,
      startDate !== undefined ? gte(transfers.createdAt, startDate) : undefined,
      endDate !== undefined ? lte(transfers.createdAt, endDate) : undefined,
      startCreatedAt !== undefined ? gte(transfers.createdAt, startCreatedAt) : undefined,
      endCreatedAt !== undefined ? lte(transfers.createdAt, endCreatedAt) : undefined,
      minAmount !== undefined ? gte(transfers.amount, minAmount) : undefined,
      maxAmount !== undefined ? lte(transfers.amount, maxAmount) : undefined,
      search !== undefined ? ilike(transfers.description, `%${search}%`) : undefined,
    ].filter(condition => condition !== undefined);

    const sortColumn = sortBy === 'date' ? transfers.createdAt :
      sortBy === 'amount' ? transfers.amount :
        transfers.createdAt;

    const sourcePocket = alias(pockets, "sourcePocket");
    const destinationPocket = alias(pockets, "destinationPocket");

    const result = await this.db
      .select({
        transfer: transfers,
        pocketTransfer: pocketTransfers,
        sourcePocket: sourcePocket,
        destinationPocket: destinationPocket,
      })
      .from(transfers)
      .innerJoin(pocketTransfers, eq(transfers.id, pocketTransfers.transferId))
      .innerJoin(sourcePocket, eq(pocketTransfers.sourcePocketId, sourcePocket.id))
      .innerJoin(destinationPocket, eq(pocketTransfers.destinationPocketId, destinationPocket.id))
      .where(and(...conditions))
      .orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn))
      .limit(limit)
      .offset(offset);

    return result.map((item) => ({
      ...item.transfer,
      ...item.pocketTransfer,
      sourcePocket: item.sourcePocket,
      destinationPocket: item.destinationPocket,
    }));
  }
}
