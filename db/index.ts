import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pinoLogger } from '../src/core/helpers/logger';

// const connectionString = process.env.DATABASE_URL!;
// const client = postgres(connectionString, { prepare: false });

// export const db = drizzle(client, {
//   logger: {
//     logQuery(query, params) {
//       if (query.toLowerCase().includes('create table')) return;
//       if (query.toLowerCase().includes('create index')) return;
//       if (query.toLowerCase().includes('create unique index')) return;
//       pinoLogger.info({ sql: query, params }, 'Executing SQL Query');
//     },
//   },
// });

export class Drizzle {
  private static instance: Drizzle;
  private _db: PostgresJsDatabase;

  private constructor() {
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString, { prepare: false });

    this._db = drizzle(client, {
      logger: {
        logQuery(query, params) {
          if (query.toLowerCase().includes('create table')) return;
          if (query.toLowerCase().includes('create index')) return;
          if (query.toLowerCase().includes('create unique index')) return;
          pinoLogger.info({ sql: query, params }, 'Executing SQL Query');
        },
      },
    });
  }

  public static getInstance(): Drizzle {
    if (!Drizzle.instance) {
      Drizzle.instance = new Drizzle();
    }
    return Drizzle.instance;
  }

  public get db(): PostgresJsDatabase {
    return this._db;
  }
}
