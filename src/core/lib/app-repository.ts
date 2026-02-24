import { Drizzle } from 'db';
import { schema } from 'db/schemas';
import { dompetRelations } from 'db/schemas/relations';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class AppRepository {
  public drizzle: Drizzle;

  constructor(drizzle: Drizzle) {
    this.drizzle = drizzle;
  }

  get db(): PostgresJsDatabase<typeof schema, typeof dompetRelations> {
    return this.drizzle.db;
  }
}