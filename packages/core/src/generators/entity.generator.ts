import type { DatabaseColumn } from "../schema/database-column.js";
import type { DatabaseRelation } from "../schema/database-relation.js";
import type { DatabaseSchema } from "../schema/database-schema.js";
import type { DatabaseTable } from "../schema/database-table.js";
import { toCamelCase, toFileName, toPascalCase } from "../utils/format-file.js";

export class EntityGenerator {
  generate(table: DatabaseTable, schema: DatabaseSchema): string {
    const className = toPascalCase(table.name);

    const imports = this.generateImports(table, schema);

    const columns = table.columns
      .map((column) => this.generateColumn(column))
      .join("\n\n");

    const outgoingRelations = table.relations
      .filter((relation) => !this.isSelfRelation(relation))
      .map((relation) => this.generateOutgoingRelation(relation))
      .join("\n\n");

    const selfRelations = this.getSelfRelations(table)
      .map((relation) => this.generateSelfRelation(relation))
      .join("\n\n");

    const incomingRelations = this.getIncomingRelations(table, schema)
      .map((relation) => this.generateIncomingRelation(relation))
      .join("\n\n");

    return `/**
 * AUTO-GENERATED FILE.
 *
 * Source table: ${table.name}
 * DO NOT EDIT MANUALLY.
 */

${imports}

@Entity("${table.name}")
export class ${className} {
${columns}

${outgoingRelations}

${selfRelations}

${incomingRelations}
}
`;
  }

  private generateImports(
    table: DatabaseTable,
    schema: DatabaseSchema,
  ): string {
    const typeormImports = new Set<string>([
      "Column",
      "Entity",
      "PrimaryGeneratedColumn",
    ]);

    const entityImports = new Map<string, string>();

    // Relaciones salientes
    for (const relation of table.relations) {
      switch (relation.type) {
        case "many-to-one":
          typeormImports.add("ManyToOne");
          typeormImports.add("JoinColumn");
          break;

        case "one-to-many":
          typeormImports.add("OneToMany");
          break;

        case "one-to-one":
          typeormImports.add("OneToOne");
          typeormImports.add("JoinColumn");
          break;

        case "many-to-many":
          typeormImports.add("ManyToMany");
          typeormImports.add("JoinTable");
          break;
      }

      if (relation.targetTable !== table.name) {
        const targetClass = toPascalCase(relation.targetTable);

        entityImports.set(
          targetClass,
          `./${toFileName(relation.targetTable)}.entity.js`,
        );
      }
    }

    // Relaciones recursivas
    const selfRelations = this.getSelfRelations(table);

    if (selfRelations.length > 0) {
      typeormImports.add("OneToMany");
    }

    // Relaciones entrantes
    const incomingRelations = this.getIncomingRelations(table, schema);

    if (incomingRelations.length > 0) {
      typeormImports.add("OneToMany");
    }

    for (const relation of incomingRelations) {
      if (relation.sourceTable === table.name) {
        continue;
      }

      const sourceClass = toPascalCase(relation.sourceTable);

      entityImports.set(
        sourceClass,
        `./${toFileName(relation.sourceTable)}.entity.js`,
      );
    }

    const imports: string[] = [];

    imports.push(
      `import {\n  ${Array.from(typeormImports).sort().join(",\n  ")},\n} from "typeorm";`,
    );

    for (const [className, path] of entityImports) {
      imports.push(`import { ${className} } from "${path}";`);
    }

    return imports.join("\n");
  }

  private generateColumn(column: DatabaseColumn): string {
    const propertyName = toCamelCase(column.name);

    if (column.autoIncrement) {
      return `  @PrimaryGeneratedColumn({
    ${this.generateColumnOptions(column).join(",\n    ")},
  })
  ${propertyName}!: ${this.getTypeScriptType(column)};`;
    }

    return `  @Column({
    ${this.generateColumnOptions(column).join(",\n    ")},
  })
  ${propertyName}!: ${this.getTypeScriptType(column)};`;
  }

  private generateOutgoingRelation(relation: DatabaseRelation): string {
    const targetClass = toPascalCase(relation.targetTable);

    const propertyName = this.getSourcePropertyName(relation.sourceColumn);

    const inversePropertyName = this.getInversePropertyName(relation);

    const parameterName = toCamelCase(relation.targetTable);

    switch (relation.type) {
      case "many-to-one":
        return `  @ManyToOne(
    () => ${targetClass},
    (${parameterName}) => ${parameterName}.${inversePropertyName},
  )
  @JoinColumn({
    name: "${relation.sourceColumn}",
    referencedColumnName: "${relation.targetColumn}",
  })
  ${propertyName}!: ${targetClass};`;

      case "one-to-one":
        return `  @OneToOne(
    () => ${targetClass},
    (${parameterName}) => ${parameterName}.${inversePropertyName},
  )
  @JoinColumn({
    name: "${relation.sourceColumn}",
    referencedColumnName: "${relation.targetColumn}",
  })
  ${propertyName}!: ${targetClass};`;

      case "one-to-many":
        return `  @OneToMany(
    () => ${targetClass},
    (${parameterName}) => ${parameterName}.${inversePropertyName},
  )
  ${propertyName}!: ${targetClass}[];`;

      case "many-to-many":
        return `  @ManyToMany(
    () => ${targetClass},
    (${parameterName}) => ${parameterName}.${inversePropertyName},
  )
  @JoinTable()
  ${propertyName}!: ${targetClass}[];`;

      default:
        return "";
    }
  }

  private generateSelfRelation(relation: DatabaseRelation): string {
    const className = toPascalCase(relation.sourceTable);

    const propertyName = this.getSourcePropertyName(relation.sourceColumn);

    const inversePropertyName = this.getInversePropertyName(relation);

    const parameterName = toCamelCase(relation.sourceTable);

    return `  @ManyToOne(
    () => ${className},
    (${parameterName}) => ${parameterName}.${inversePropertyName},
  )
  @JoinColumn({
    name: "${relation.sourceColumn}",
    referencedColumnName: "${relation.targetColumn}",
  })
  ${propertyName}!: ${className};

  @OneToMany(
    () => ${className},
    (${parameterName}) => ${parameterName}.${propertyName},
  )
  ${inversePropertyName}!: ${className}[];`;
  }

  private generateIncomingRelation(relation: DatabaseRelation): string {
    const sourceClass = toPascalCase(relation.sourceTable);

    const propertyName = this.getInversePropertyName(relation);

    const parameterName = toCamelCase(relation.sourceTable);

    const sourcePropertyName = this.getSourcePropertyName(
      relation.sourceColumn,
    );

    return `  @OneToMany(
    () => ${sourceClass},
    (${parameterName}) => ${parameterName}.${sourcePropertyName},
  )
  ${propertyName}!: ${sourceClass}[];`;
  }

  private getIncomingRelations(
    table: DatabaseTable,
    schema: DatabaseSchema,
  ): DatabaseRelation[] {
    return schema.tables
      .flatMap((currentTable) => currentTable.relations)
      .filter(
        (relation) =>
          relation.targetTable === table.name &&
          relation.sourceTable !== table.name,
      );
  }

  private getSelfRelations(table: DatabaseTable): DatabaseRelation[] {
    return table.relations.filter((relation) => this.isSelfRelation(relation));
  }

  private isSelfRelation(relation: DatabaseRelation): boolean {
    return relation.sourceTable === relation.targetTable;
  }

  private getSourcePropertyName(sourceColumn: string): string {
    const columnWithoutId = sourceColumn.endsWith("_id")
      ? sourceColumn.slice(0, -3)
      : sourceColumn;

    return toCamelCase(columnWithoutId);
  }

  private getInversePropertyName(relation: DatabaseRelation): string {
    if (this.isSelfRelation(relation)) {
      return "derivedDiets";
    }

    return `${toCamelCase(relation.sourceTable)}`;
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

      case "enum":
        return this.getEnumType(column);

      default:
        return "unknown";
    }
  }

  private generateEnumColumn(column: DatabaseColumn): string {
    const propertyName = toCamelCase(column.name);
    const enumValues = column.enumValues ?? [];

    const options = [
      `type: "enum"`,
      `enum: [${enumValues.map((value) => `"${value}"`).join(", ")}]`,
      `name: "${column.name}"`,
      `nullable: ${column.nullable}`,
    ];

    if (column.defaultValue !== undefined && column.defaultValue !== null) {
      options.push(`default: "${column.defaultValue}"`);
    }

    const type =
      enumValues.length > 0
        ? enumValues.map((value) => `"${value}"`).join(" | ")
        : "string";

    return `  @Column({
    ${options.join(",\n    ")},
  })
  ${propertyName}!: ${type};`;
  }

  private getEnumType(column: DatabaseColumn): string {
    const values = column.enumValues ?? [];

    if (values.length === 0) {
      return "string";
    }

    return values.map((value) => `"${value}"`).join(" | ");
  }

  private generateColumnOptions(column: DatabaseColumn): string[] {
    const options: string[] = [
      `type: "${this.getDatabaseType(column)}"`,
      `name: "${column.name}"`,
      `nullable: ${column.nullable}`,
    ];

    if (column.unsigned) {
      options.push("unsigned: true");
    }

    if (column.length !== undefined) {
      options.push(`length: ${column.length}`);
    }

    if (column.precision !== undefined) {
      options.push(`precision: ${column.precision}`);
    }

    if (column.scale !== undefined) {
      options.push(`scale: ${column.scale}`);
    }

    if (column.type === "enum") {
      options.push(
        `enum: [${(column.enumValues ?? [])
          .map((value) => `"${value}"`)
          .join(", ")}]`,
      );
    }

    if (column.defaultValue !== undefined && column.defaultValue !== null) {
      options.push(`default: ${this.formatDefaultValue(column.defaultValue)}`);
    }

    return options;
  }

  private formatDefaultValue(value: unknown): string {
    if (typeof value === "string") {
      if (this.isSqlExpression(value)) {
        return `() => "${value}"`;
      }

      return `"${value.replace(/"/g, '\\"')}"`;
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (typeof value === "boolean") {
      return String(value);
    }

    return JSON.stringify(value);
  }
  private isSqlExpression(value: string): boolean {
    const normalizedValue = value.trim().toUpperCase();

    return (
      normalizedValue.startsWith("CURRENT_TIMESTAMP") ||
      normalizedValue.startsWith("CURRENT_DATE") ||
      normalizedValue.startsWith("CURRENT_TIME") ||
      normalizedValue.startsWith("NOW()")
    );
  }
}
