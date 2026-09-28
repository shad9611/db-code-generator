import { GenerationEngine, FileSystemWriter } from "@db-code-generator/core";
import { MysqlAdapter } from "./mysql.adapter.js";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main(): Promise<void> {
  const adapter = new MysqlAdapter({
    host: getRequiredEnv("DB_HOST"),
    port: Number(process.env["DB_PORT"] ?? 3306),
    user: getRequiredEnv("DB_USER"),
    password: process.env["DB_PASSWORD"] ?? "",
    database: getRequiredEnv("DB_NAME"),
  });

  try {
    // 1. Obtener el esquema real de MySQL.
    console.log("Connecting to MySQL...");

    const schema = await adapter.introspect();

    console.log("\nDatabase introspection completed.");
    console.log(`Database: ${schema.name}`);
    console.log(`Engine: ${schema.engine}`);
    console.log(`Tables found: ${schema.tables.length}`);

    // 2. Mostrar un resumen de las tablas.
    for (const table of schema.tables) {
      console.log(
        `- ${table.name}: ` +
          `${table.columns.length} columns, ` +
          `${table.indexes.length} indexes, ` +
          `${table.relations.length} relations`,
      );
    }

    // 3. Generar los archivos en memoria.
    const engine = new GenerationEngine();
    const files = engine.generate(schema);

    const writer = new FileSystemWriter({
      outputDirectory: "./tmp/generated",
    });

    await writer.write(files);

    // 4. Validar el resultado.
    const expectedFiles = schema.tables.length * 3;

    if (files.length !== expectedFiles) {
      throw new Error(
        `Expected ${expectedFiles} generated files, ` +
          `but received ${files.length}.`,
      );
    }

    for (const file of files) {
      if (!file.content.trim()) {
        throw new Error(`Generated file is empty: ${file.path}`);
      }
    }

    // 5. Mostrar los archivos generados.
    console.log("\nGenerated files:");

    for (const file of files) {
      console.log(`- ${file.path}`);
    }

    console.log(`\nTotal generated files: ${files.length}`);
    console.log("Integration test passed.");
  } finally {
    await adapter.close();
  }
}

main().catch((error: unknown) => {
  console.error("Integration test failed:", error);
  process.exitCode = 1;
});
