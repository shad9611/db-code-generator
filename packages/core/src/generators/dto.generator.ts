import type { DatabaseColumn } from "../schema/database-column.js";
import type { DatabaseTable } from "../schema/database-table.js";
import { toCamelCase, toPascalCase } from "../utils/format-file.js";

export class DtoGenerator {
  generate(table: DatabaseTable): string {
    const className = toPascalCase(table.name);

    const imports = this.generateImports(table);

    const properties = table.columns
      .filter((column) => !column.autoIncrement)
      .map((column) => this.generateProperty(column))
      .join("\n\n");

    return `/**
 * AUTO-GENERATED FILE.
 *
 * Source table: ${table.name}
 * DO NOT EDIT MANUALLY.
 */

${imports}

export class Create${className}Dto {
${properties}
}

export class Update${className}Dto extends Create${className}Dto {}
`;
  }

  private generateImports(table: DatabaseTable): string {
    const imports = new Set<string>();

    for (const column of table.columns) {
      if (column.type === "string") {
        imports.add("IsString");
      }

      if (column.type === "number") {
        imports.add("IsNumber");
      }

      if (column.type === "boolean") {
        imports.add("IsBoolean");
      }

      if (column.type === "date" || column.type === "datetime") {
        imports.add("IsDate");
      }

      if (column.nullable) {
        imports.add("IsOptional");
      }
    }

    if (!imports.size) {
      return "";
    }

    return `import {
  ${Array.from(imports).sort().join(",\n  ")},
} from 'class-validator';`;
  }

  private generateProperty(column: DatabaseColumn): string {
    const propertyName = toCamelCase(column.name);

    const decorators: string[] = [];

    if (column.nullable) {
      decorators.push("  @IsOptional()");
    }

    switch (column.type) {
      case "string":
        decorators.push("  @IsString()");
        break;

      case "number":
        decorators.push("  @IsNumber()");
        break;

      case "boolean":
        decorators.push("  @IsBoolean()");
        break;

      case "date":
      case "datetime":
        decorators.push("  @IsDate()");
        break;
    }

    const type = this.getTypeScriptType(column);

    const optional = column.nullable ? "?" : "";

    return `${decorators.join("\n")}
  ${propertyName}${optional}: ${type}${column.nullable ? " | null" : ""};`;
  }

  private getTypeScriptType(column: DatabaseColumn): string {
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
}
