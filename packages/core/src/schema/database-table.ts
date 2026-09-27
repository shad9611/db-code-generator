import type { DatabaseColumn } from "./database-column.js";
import { DatabaseIndex } from "./database-index.js";
import type { DatabaseRelation } from "./database-relation.js";

export interface DatabaseTable {
  name: string;

  columns: DatabaseColumn[];

  relations: DatabaseRelation[];

  indexes: DatabaseIndex[];
}
