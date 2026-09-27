import type { DatabaseTable } from "./database-table.js";

export type DatabaseEngine = "mysql" | "postgres" | "sqlserver" | "mongodb";

export interface DatabaseSchema {
  engine: DatabaseEngine;

  name: string;

  tables: DatabaseTable[];
}
