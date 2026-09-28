import type { DatabaseColumn } from "../schema/database-column.js";
import type { DatabaseTable } from "../schema/database-table.js";
import { toPascalCase, toCamelCase } from "../utils/format-file.js";

export interface ModelGeneratorOptions {
  includeComments?: boolean;
}

export class ModelGenerator {
  constructor(private readonly options: ModelGeneratorOptions = {}) {}

  generate(table: DatabaseTable): string {
    const className = toPascalCase(table.name);

    const properties = table.columns
      .map((column) => this.generateProperty(column))
      .join("\n");

    return `${this.generateHeader(table)}

export interface ${className}Model {
${properties}
}
`;
  }

  private generateProperty(column: DatabaseColumn): string {
    const propertyName = toCamelCase(column.name);

    const type = this.getType(column);

    const nullable = column.nullable ? " | null" : "";

    return `  ${propertyName}: ${type}${nullable};`;
  }

  private getType(column: DatabaseColumn): string {
    switch (column.type) {
      case "string":
        return "string";

      case "number":
        return "number";

      case "boolean":
        return "boolean";

      case "date":
      case "datetime":
        return "Date";

      case "json":
        return "Record<string, unknown>";

      case "binary":
        return "Buffer";

      default:
        return "unknown";
    }
  }

  private generateHeader(table: DatabaseTable): string {
    return `/**
 * AUTO-GENERATED FILE.
 *
 * Source table: ${table.name}
 * DO NOT EDIT MANUALLY.
 */`;
  }
}
