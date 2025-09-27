import { User } from '@/core/entities/user-entity';
import { AccountFilter, AccountSelect, CreateAccountRequest } from './account.schema';
import { Drizzle } from 'db';
import { accounts } from 'db/schemas/accounts';
import { and, desc, eq, ilike } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class AccountService {
  private drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  private get db(): PostgresJsDatabase {
    return this.drizzle.db;
  }

  async create(user: User, payload: CreateAccountRequest): Promise<AccountSelect> {
    const [account] = await this.db
      .insert(accounts)
      .values({ ...payload, userId: user.uid })
      .returning();

    return account;
  }

  async get(user: User): Promise<AccountSelect> {
    const [account] = await this.db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, user.uid))
      .limit(1);

    return account;
  }

  async list(user: User, query?: AccountFilter): Promise<AccountSelect[]> {
    const queries = [
      eq(accounts.userId, user.uid),
    ];

    if (query?.type) {
      queries.push(eq(accounts.type, query.type));
    }

    if (query?.keyword) {
      queries.push(ilike(accounts.name, `%${query.keyword}%`));
    }

    const allAccounts = await this.db
      .select()
      .from(accounts)
      .where(and(...queries))
      .orderBy(desc(accounts.createdAt));

    return allAccounts;
  }
}
