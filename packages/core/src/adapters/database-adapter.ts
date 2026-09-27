import { DatabaseSchema } from "../schema/database-schema.js";

export interface DatabaseAdapter {
  introspect(): Promise<DatabaseSchema>;
  close(): Promise<void>;
}
