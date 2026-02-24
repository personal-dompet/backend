import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pinoLogger } from '../src/core/helpers/logger';
import { schema } from './schemas';
import { dompetRelations } from './schemas/relations';

export class Drizzle {
  private static _instance: Drizzle;
  private _db: PostgresJsDatabase<typeof schema, typeof dompetRelations>;

  private constructor() {
    const connectionString = process.env.DATABASE_URL!;
    const client = postgres(connectionString, { prepare: false });

    this._db = drizzle({
      client,
      schema,
      relations: dompetRelations,
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

  public static get instance(): Drizzle {
    if (!Drizzle._instance) {
      Drizzle._instance = new Drizzle();
    }
    return Drizzle._instance;
  }

  public get db(): PostgresJsDatabase<typeof schema, typeof dompetRelations> {
    return this._db;
  }
}
