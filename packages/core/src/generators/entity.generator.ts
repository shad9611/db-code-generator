import type { DatabaseColumn } from "../schema/database-column.js";
import type { DatabaseRelation } from "../schema/database-relation.js";
import type { DatabaseTable } from "../schema/database-table.js";

export class EntityGenerator {
  generate(table: DatabaseTable): string {
    const className = this.toPascalCase(table.name);

    const imports = this.generateImports(table);

    const columns = table.columns
      .map((column) => this.generateColumn(column))
      .join("\n\n");

    const relations = table.relations
      .map((relation) => this.generateRelation(relation))
      .join("\n\n");

    return `/**
 * AUTO-GENERATED FILE.
 *
 * Source table: ${table.name}
 * DO NOT EDIT MANUALLY.
 */

${imports}

@Entity('${table.name}')
export class ${className} {
${columns}

${relations}
}
`;
  }

  private generateImports(table: DatabaseTable): string {
    const imports = new Set<string>([
      "Column",
      "Entity",
      "PrimaryGeneratedColumn",
    ]);

    for (const relation of table.relations) {
      switch (relation.type) {
        case "many-to-one":
          imports.add("ManyToOne");
          imports.add("JoinColumn");
          break;

        case "one-to-many":
          imports.add("OneToMany");
          break;

        case "one-to-one":
          imports.add("OneToOne");
          imports.add("JoinColumn");
          break;

        case "many-to-many":
          imports.add("ManyToMany");
          imports.add("JoinTable");
          break;
      }
    }

    return `import {
  ${Array.from(imports).sort().join(",\n  ")},
} from 'typeorm';`;
  }

  private generateColumn(column: DatabaseColumn): string {
    const propertyName = this.toCamelCase(column.name);

    if (column.autoIncrement) {
      return `  @PrimaryGeneratedColumn({
    type: '${this.getDatabaseType(column)}',
    name: '${column.name}',
    unsigned: ${column.unsigned},
  })
  ${propertyName}!: number;`;
    }

    return `  @Column({
    type: '${this.getDatabaseType(column)}',
    name: '${column.name}',
    nullable: ${column.nullable},
  })
  ${propertyName}!: ${this.getTypeScriptType(column)};`;
  }

  private generateRelation(relation: DatabaseRelation): string {
    const targetClass = this.toPascalCase(relation.targetTable);
    const propertyName = this.toCamelCase(relation.targetTable);

    switch (relation.type) {
      case "many-to-one":
        return `  @ManyToOne(
    () => ${targetClass},
    (${propertyName}) => ${propertyName}.${this.toCamelCase(relation.sourceTable)},
  )
  @JoinColumn({
    name: '${relation.sourceColumn}',
    referencedColumnName: '${relation.targetColumn}',
  })
  ${propertyName}!: ${targetClass};`;

      case "one-to-many":
        return `  @OneToMany(
    () => ${targetClass},
    (${propertyName}) => ${propertyName}.${this.toCamelCase(relation.sourceTable)},
  )
  ${this.toCamelCase(relation.targetTable)}s!: ${targetClass}[];`;

      default:
        return "";
    }
  }

  private getDatabaseType(column: DatabaseColumn): string {
    return column.databaseType;
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

  private toPascalCase(value: string): string {
    return value
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  }

  private toCamelCase(value: string): string {
    const pascal = this.toPascalCase(value);

    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }
}
