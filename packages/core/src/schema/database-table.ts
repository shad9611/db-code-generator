import type { DatabaseColumn } from "./database-column.js";
import type { DatabaseRelation } from "./database-relation.js";

export interface DatabaseIndex {
  name: string;

  columns: string[];

  unique: boolean;

  primary: boolean;
}

export interface DatabaseTable {
  name: string;

  columns: DatabaseColumn[];

  relations: DatabaseRelation[];

  indexes: DatabaseIndex[];
}
