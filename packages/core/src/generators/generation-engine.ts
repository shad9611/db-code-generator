import type { DatabaseSchema } from "../schema/database-schema.js";
import { DtoGenerator } from "./dto.generator.js";
import { EntityGenerator } from "./entity.generator.js";
import { ModelGenerator } from "./model.generator.js";
import type { GeneratedFile } from "./generated-file.js";
import { toFileName } from "../utils/format-file.js";

export interface GenerationEngineOptions {
  entities?: boolean;
  dtos?: boolean;
  models?: boolean;
}

export class GenerationEngine {
  constructor(
    private readonly options: GenerationEngineOptions = {},
    private readonly entityGenerator = new EntityGenerator(),
    private readonly dtoGenerator = new DtoGenerator(),
    private readonly modelGenerator = new ModelGenerator(),
  ) {}

  generate(schema: DatabaseSchema): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    for (const table of schema.tables) {
      if (this.options.entities !== false) {
        files.push({
          path: `entities/${toFileName(table.name)}.entity.ts`,
          content: this.entityGenerator.generate(table, schema),
        });
      }

      if (this.options.dtos !== false) {
        files.push({
          path: `dtos/${toFileName(table.name)}.dto.ts`,
          content: this.dtoGenerator.generate(table),
        });
      }

      if (this.options.models !== false) {
        files.push({
          path: `models/${toFileName(table.name)}.model.ts`,
          content: this.modelGenerator.generate(table),
        });
      }
    }

    return files;
  }
}
