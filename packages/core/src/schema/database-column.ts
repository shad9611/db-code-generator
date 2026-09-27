export type DatabaseColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "json"
  | "binary"
  | "enun"
  | "unknown";

export interface DatabaseColumn {
  name: string;
  type: DatabaseColumnType;

  nullable: boolean;

  /**
   * Indicates whether the column is part of the primary key.
   */
  primaryKey: boolean;

  /**
   * Indicates whether the database generates the value automatically.
   */
  autoIncrement: boolean;

  /**
   * Indicates whether the database column is unsigned.
   */
  unsigned: boolean;

  /**
   * Database-specific type.
   *
   * Example:
   * - varchar(150)
   * - decimal(5,2)
   * - enum('active','inactive')
   */
  databaseType: string;

  length?: number;

  precision?: number;

  scale?: number;

  defaultValue?: unknown;

  /**
   * Enum values when the column is an enum.
   */
  enumValues?: string[];
}
