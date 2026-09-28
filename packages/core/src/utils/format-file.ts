import { DatabaseRelation } from "../schema/database-relation.js";
import { DatabaseSchema } from "../schema/database-schema.js";
import { DatabaseTable } from "../schema/database-table.js";

function toFileName(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function toPascalCase(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toCamelCase(value: string): string {
  const pascal = toPascalCase(value);

  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function getSourcePropertyName(columnName: string): string {
  const normalizedName = columnName.replace(/_id$/, "");

  return toCamelCase(normalizedName);
}

export { toFileName, toPascalCase, toCamelCase, getSourcePropertyName };
