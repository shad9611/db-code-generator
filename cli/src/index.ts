#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

program
  .name("db-code-generator")
  .description("Database schema introspection and code generator")
  .version("0.1.0");

program
  .command("generate")
  .description("Generate code from a database schema")
  .requiredOption("--database <engine>", "Database engine")
  .requiredOption("--host <host>", "Database host")
  .requiredOption("--port <port>", "Database port")
  .requiredOption("--user <user>", "Database user")
  .requiredOption("--password <password>", "Database password")
  .requiredOption("--database-name <name>", "Database name")
  .option("--orm <orm>", "Target ORM", "typeorm")
  .option("--output <directory>", "Output directory", "./generated")
  .action(async (options) => {
    console.log("Database:", options.database);
    console.log("Host:", options.host);
    console.log("ORM:", options.orm);
    console.log("Output:", options.output);
  });

await program.parseAsync();
