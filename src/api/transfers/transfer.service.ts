import { Drizzle } from 'db';
import {
  PocketTransferRequest,
  TransferFilter,
  PocketTransferDetailSelect,
  AccountTransferRequest,
  AccountTransferDetailSelect,
} from './transfer.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { transfers } from 'db/schemas/transfers';
import { pocketTransfers } from 'db/schemas/pocket-transfers';
import { pockets } from 'db/schemas/pockets';
import { and, eq, gte, lte, isNull, ilike, asc, desc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { User } from '@/core/dto/user';
import { accounts } from 'db/schemas/accounts';
import { accountTransfers } from 'db/schemas/account-transfers';

export class TransferService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async createPocketTransfer(
    request: PocketTransferRequest,
    user: User
  ): Promise<PocketTransferDetailSelect> {
    const { amount, description, sourceId: sourceId, destinationId } = request;
    const userId = user.uid;

    const transfer: PocketTransferDetailSelect = await this.db.transaction(
      async (tx) => {
        const [sourcePocket] = await tx
          .select()
          .from(pockets)
          .where(and(eq(pockets.id, sourceId), isNull(pockets.deletedAt)))
          .limit(1);
        if (!sourcePocket) {
          throw new Error('Source pocket not found');
        }
        const [destinationPocket] = await tx
          .select()
          .from(pockets)
          .where(and(eq(pockets.id, destinationId), isNull(pockets.deletedAt)))
          .limit(1);
        if (!destinationPocket) {
          throw new Error('Destination pocket not found');
        }

        const [transfer] = await tx
          .insert(transfers)
          .values({
            userId,
            amount,
            description,
          })
          .returning();

        const [pocketTransfer] = await tx
          .insert(pocketTransfers)
          .values({
            transferId: transfer.id,
            sourceId: sourcePocket.id,
            destinationId: destinationPocket.id,
          })
          .returning();

        // Update source pocket balance
        const [sourcePocketUpdate] = await tx
          .update(pockets)
          .set({
            balance: sourcePocket.balance - amount,
          })
          .where(eq(pockets.id, sourcePocket.id))
          .returning();

        // Update destination pocket balance
        const [destinationPocketUpdate] = await tx
          .update(pockets)
          .set({
            balance: destinationPocket.balance + amount,
          })
          .where(eq(pockets.id, destinationPocket.id))
          .returning();

        return {
          ...transfer,
          ...pocketTransfer,
          source: sourcePocketUpdate,
          destination: destinationPocketUpdate,
        };
      }
    );

    return transfer;
  }

  async pocketTransfers(
    filter: TransferFilter,
    user: User
  ): Promise<PocketTransferDetailSelect[]> {
    const {
      page,
      limit = 20,
      sourceId,
      destinationId,
      startDate,
      endDate,
      startCreatedAt,
      endCreatedAt,
      minAmount,
      maxAmount,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = filter;

    const offset = (page - 1) * limit;
    const userId = user.uid;

    // Build conditions array for conditional filtering
    const conditions = [
      userId !== undefined ? eq(transfers.userId, userId) : undefined,
      sourceId !== undefined
        ? eq(pocketTransfers.sourceId, sourceId)
        : undefined,
      destinationId !== undefined
        ? eq(pocketTransfers.destinationId, destinationId)
        : undefined,
      startDate !== undefined ? gte(transfers.createdAt, startDate) : undefined,
      endDate !== undefined ? lte(transfers.createdAt, endDate) : undefined,
      startCreatedAt !== undefined
        ? gte(transfers.createdAt, startCreatedAt)
        : undefined,
      endCreatedAt !== undefined
        ? lte(transfers.createdAt, endCreatedAt)
        : undefined,
      minAmount !== undefined ? gte(transfers.amount, minAmount) : undefined,
      maxAmount !== undefined ? lte(transfers.amount, maxAmount) : undefined,
      search !== undefined
        ? ilike(transfers.description, `%${search}%`)
        : undefined,
    ].filter((condition) => condition !== undefined);

    const sortColumn =
      sortBy === 'date'
        ? transfers.createdAt
        : sortBy === 'amount'
        ? transfers.amount
        : transfers.createdAt;

    const sourcePocket = alias(pockets, 'sourcePocket');
    const destinationPocket = alias(pockets, 'destinationPocket');

    const result = await this.db
      .select({
        transfer: transfers,
        pocketTransfer: pocketTransfers,
        sourcePocket: sourcePocket,
        destinationPocket: destinationPocket,
      })
      .from(transfers)
      .innerJoin(pocketTransfers, eq(transfers.id, pocketTransfers.transferId))
      .innerJoin(sourcePocket, eq(pocketTransfers.sourceId, sourcePocket.id))
      .innerJoin(
        destinationPocket,
        eq(pocketTransfers.destinationId, destinationPocket.id)
      )
      .where(and(...conditions))
      .orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn))
      .limit(limit)
      .offset(offset);

    return result.map((item) => ({
      ...item.transfer,
      ...item.pocketTransfer,
      source: item.sourcePocket,
      destination: item.destinationPocket,
    }));
  }

  async createAccountTransfer(
    request: AccountTransferRequest,
    user: User
  ): Promise<AccountTransferDetailSelect> {
    const { amount, description, sourceId: sourceId, destinationId } = request;
    const userId = user.uid;

    const transfer: AccountTransferDetailSelect = await this.db.transaction(
      async (tx) => {
        const [sourceAccount] = await tx
          .select()
          .from(accounts)
          .where(and(eq(accounts.id, sourceId), isNull(accounts.deletedAt)))
          .limit(1);
        if (!sourceAccount) {
          throw new Error('Source account not found');
        }
        const [destinationAccount] = await tx
          .select()
          .from(accounts)
          .where(
            and(eq(accounts.id, destinationId), isNull(accounts.deletedAt))
          )
          .limit(1);
        if (!destinationAccount) {
          throw new Error('Destination account not found');
        }

        const [transfer] = await tx
          .insert(transfers)
          .values({
            userId,
            amount,
            description,
          })
          .returning();

        const [accountTransfer] = await tx
          .insert(accountTransfers)
          .values({
            transferId: transfer.id,
            sourceId: sourceAccount.id,
            destinationId: destinationAccount.id,
          })
          .returning();

        // Update source account balance
        const [sourceAccountUpdate] = await tx
          .update(accounts)
          .set({
            balance: sourceAccount.balance - amount,
          })
          .where(eq(accounts.id, sourceAccount.id))
          .returning();

        // Update destination account balance
        const [destinationAccountUpdate] = await tx
          .update(accounts)
          .set({
            balance: destinationAccount.balance + amount,
          })
          .where(eq(accounts.id, destinationAccount.id))
          .returning();

        return {
          ...transfer,
          ...accountTransfer,
          source: sourceAccountUpdate,
          destination: destinationAccountUpdate,
        };
      }
    );

    return transfer;
  }

  async accountTransfers(
    filter: TransferFilter,
    user: User
  ): Promise<AccountTransferDetailSelect[]> {
    const {
      page,
      limit = 20,
      sourceId,
      destinationId,
      startDate,
      endDate,
      startCreatedAt,
      endCreatedAt,
      minAmount,
      maxAmount,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = filter;

    const offset = (page - 1) * limit;
    const userId = user.uid;

    // Build conditions array for conditional filtering
    const conditions = [
      userId !== undefined ? eq(transfers.userId, userId) : undefined,
      sourceId !== undefined
        ? eq(accountTransfers.sourceId, sourceId)
        : undefined,
      destinationId !== undefined
        ? eq(accountTransfers.destinationId, destinationId)
        : undefined,
      startDate !== undefined ? gte(transfers.createdAt, startDate) : undefined,
      endDate !== undefined ? lte(transfers.createdAt, endDate) : undefined,
      startCreatedAt !== undefined
        ? gte(transfers.createdAt, startCreatedAt)
        : undefined,
      endCreatedAt !== undefined
        ? lte(transfers.createdAt, endCreatedAt)
        : undefined,
      minAmount !== undefined ? gte(transfers.amount, minAmount) : undefined,
      maxAmount !== undefined ? lte(transfers.amount, maxAmount) : undefined,
      search !== undefined
        ? ilike(transfers.description, `%${search}%`)
        : undefined,
    ].filter((condition) => condition !== undefined);

    const sortColumn =
      sortBy === 'date'
        ? transfers.createdAt
        : sortBy === 'amount'
        ? transfers.amount
        : transfers.createdAt;

    const sourceAccount = alias(accounts, 'sourceAccount');
    const destinationAccount = alias(accounts, 'destinationAccount');

    const result = await this.db
      .select({
        transfer: transfers,
        accountTransfer: accountTransfers,
        sourceAccount: sourceAccount,
        destinationAccount: destinationAccount,
      })
      .from(transfers)
      .innerJoin(
        accountTransfers,
        eq(transfers.id, accountTransfers.transferId)
      )
      .innerJoin(sourceAccount, eq(accountTransfers.sourceId, sourceAccount.id))
      .innerJoin(
        destinationAccount,
        eq(accountTransfers.destinationId, destinationAccount.id)
      )
      .where(and(...conditions))
      .orderBy(sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn))
      .limit(limit)
      .offset(offset);

    return result.map((item) => ({
      ...item.transfer,
      ...item.accountTransfer,
      source: item.sourceAccount,
      destination: item.destinationAccount,
    }));
  }
}
