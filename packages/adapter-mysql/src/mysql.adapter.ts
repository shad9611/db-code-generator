import type {
  DatabaseColumn,
  DatabaseIndex,
  DatabaseRelation,
  DatabaseSchema,
  DatabaseTable,
  DatabaseAdapter,
} from "@db-code-generator/core";

import mysql, { type PoolOptions, type RowDataPacket } from "mysql2/promise";

interface MysqlTableRow extends RowDataPacket {
  TABLE_NAME: string;
}

interface MysqlColumnRow extends RowDataPacket {
  TABLE_NAME: string;
  COLUMN_NAME: string;
  DATA_TYPE: string;
  IS_NULLABLE: "YES" | "NO";
  COLUMN_KEY: string;
  EXTRA: string;
  COLUMN_TYPE: string;
  CHARACTER_MAXIMUM_LENGTH: number | null;
  NUMERIC_PRECISION: number | null;
  NUMERIC_SCALE: number | null;
  COLUMN_DEFAULT: unknown;
}

interface MysqlForeignKeyRow extends RowDataPacket {
  TABLE_NAME: string;
  COLUMN_NAME: string;
  REFERENCED_TABLE_NAME: string;
  REFERENCED_COLUMN_NAME: string;
  CONSTRAINT_NAME: string;
  DELETE_RULE: string;
  UPDATE_RULE: string;
}

interface MysqlIndexRow extends RowDataPacket {
  TABLE_NAME: string;
  INDEX_NAME: string;
  NON_UNIQUE: number;
  COLUMN_NAME: string | null;
  SEQ_IN_INDEX: number;
}

export interface MysqlAdapterOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class MysqlAdapter implements DatabaseAdapter {
  private readonly pool: mysql.Pool;

  constructor(options: MysqlAdapterOptions) {
    const poolOptions: PoolOptions = {
      host: options.host,
      port: options.port,
      user: options.user,
      password: options.password,
      database: options.database,
    };

    this.pool = mysql.createPool(poolOptions);
  }

  async introspect(): Promise<DatabaseSchema> {
    const tables = await this.getTables();

    const databaseTables: DatabaseTable[] = [];

    for (const table of tables) {
      const columns = await this.getColumns(table.name);
      const relations = await this.getRelations(table.name);
      const indexes = await this.getIndexes(table.name);

      databaseTables.push({
        name: table.name,
        columns,
        relations,
        indexes,
      });
    }

    return {
      engine: "mysql",
      name: await this.getDatabaseName(),
      tables: databaseTables,
    };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  private async getDatabaseName(): Promise<string> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      "SELECT DATABASE() AS database_name",
    );

    return String(rows[0]?.["database_name"] ?? "");
  }

  private async getTables(): Promise<Array<{ name: string }>> {
    const [rows] = await this.pool.query<MysqlTableRow[]>(
      `
        SELECT TABLE_NAME
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_TYPE = 'BASE TABLE'
        ORDER BY TABLE_NAME
      `,
    );

    return rows.map((row) => ({
      name: row.TABLE_NAME,
    }));
  }

  private async getColumns(tableName: string): Promise<DatabaseColumn[]> {
    const [rows] = await this.pool.query<MysqlColumnRow[]>(
      `
        SELECT
          TABLE_NAME,
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          COLUMN_KEY,
          EXTRA,
          COLUMN_TYPE,
          CHARACTER_MAXIMUM_LENGTH,
          NUMERIC_PRECISION,
          NUMERIC_SCALE,
          COLUMN_DEFAULT
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `,
      [tableName],
    );

    return rows.map((row) => ({
      name: row.COLUMN_NAME,
      type: this.mapColumnType(row.DATA_TYPE),
      nullable: row.IS_NULLABLE === "YES",
      primaryKey: row.COLUMN_KEY === "PRI",
      autoIncrement: row.EXTRA.includes("auto_increment"),
      unsigned: row.COLUMN_TYPE.includes("unsigned"),
      databaseType: row.DATA_TYPE,
      length: row.CHARACTER_MAXIMUM_LENGTH ?? undefined,
      precision: row.NUMERIC_PRECISION ?? undefined,
      scale: row.NUMERIC_SCALE ?? undefined,
      defaultValue: row.COLUMN_DEFAULT ?? undefined,
      enumValues:
        row.DATA_TYPE.toLowerCase() === "enum"
          ? this.parseEnumValues(row.COLUMN_TYPE)
          : undefined,
    }));
  }

  private async getRelations(tableName: string): Promise<DatabaseRelation[]> {
    const [rows] = await this.pool.query<MysqlForeignKeyRow[]>(
      `
      SELECT
        kcu.TABLE_NAME,
        kcu.COLUMN_NAME,
        kcu.REFERENCED_TABLE_NAME,
        kcu.REFERENCED_COLUMN_NAME,
        kcu.CONSTRAINT_NAME,
        rc.DELETE_RULE,
        rc.UPDATE_RULE
      FROM information_schema.KEY_COLUMN_USAGE AS kcu
      INNER JOIN information_schema.REFERENTIAL_CONSTRAINTS AS rc
        ON rc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
        AND rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
      WHERE kcu.TABLE_SCHEMA = DATABASE()
        AND kcu.TABLE_NAME = ?
        AND kcu.REFERENCED_TABLE_NAME IS NOT NULL
      ORDER BY kcu.ORDINAL_POSITION
    `,
      [tableName],
    );

    return rows.map((row) => ({
      type: "many-to-one",
      sourceTable: row.TABLE_NAME,
      sourceColumn: row.COLUMN_NAME,
      targetTable: row.REFERENCED_TABLE_NAME,
      targetColumn: row.REFERENCED_COLUMN_NAME,
      constraintName: row.CONSTRAINT_NAME,
      onDelete: row.DELETE_RULE,
      onUpdate: row.UPDATE_RULE,
    }));
  }

  private async getIndexes(tableName: string): Promise<DatabaseIndex[]> {
    const [rows] = await this.pool.query<MysqlIndexRow[]>(
      `
      SELECT
        TABLE_NAME,
        INDEX_NAME,
        NON_UNIQUE,
        COLUMN_NAME,
        SEQ_IN_INDEX
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `,
      [tableName],
    );

    const indexes = new Map<string, DatabaseIndex>();

    for (const row of rows) {
      if (!row.COLUMN_NAME) {
        continue;
      }

      const existingIndex = indexes.get(row.INDEX_NAME);

      if (existingIndex) {
        existingIndex.columns.push(row.COLUMN_NAME);
        continue;
      }

      indexes.set(row.INDEX_NAME, {
        name: row.INDEX_NAME,
        columns: [row.COLUMN_NAME],
        unique: row.NON_UNIQUE === 0,
        primary: row.INDEX_NAME === "PRIMARY",
      });
    }

    return [...indexes.values()];
  }

  private mapColumnType(databaseType: string): DatabaseColumn["type"] {
    switch (databaseType.toLowerCase()) {
      case "varchar":
      case "char":
      case "text":
      case "tinytext":
      case "mediumtext":
      case "longtext":
        return "string";

      case "int":
      case "bigint":
      case "smallint":
      case "mediumint":
      case "tinyint":
      case "decimal":
      case "numeric":
      case "float":
      case "double":
        return "number";

      case "boolean":
        return "boolean";

      case "date":
        return "date";

      case "datetime":
      case "timestamp":
        return "datetime";

      case "json":
        return "json";

      case "blob":
      case "tinyblob":
      case "mediumblob":
      case "longblob":
        return "binary";
      case "enum":
        return "enum";

      default:
        return "unknown";
    }
  }

  private parseEnumValues(columnType: string): string[] {
    const match = columnType.match(/^enum\((.*)\)$/i);

    if (!match) {
      return [];
    }

    const values = match[1];

    const result: string[] = [];

    let current = "";
    let escaping = false;
    let insideString = false;

    for (const char of values) {
      if (escaping) {
        current += char;
        escaping = false;
        continue;
      }

      if (char === "\\") {
        escaping = true;
        continue;
      }

      if (char === "'") {
        insideString = !insideString;
        continue;
      }

      if (char === "," && !insideString) {
        result.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    if (current.length > 0) {
      result.push(current.trim());
    }

    return result;
  }
}
