import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { GeneratedFile } from "../generators/generated-file.js";

export interface FileSystemWriterOptions {
  outputDirectory: string;
}

export class FileSystemWriter {
  constructor(private readonly options: FileSystemWriterOptions) {}

  async write(files: GeneratedFile[]): Promise<void> {
    const outputDirectory = resolve(this.options.outputDirectory);

    for (const file of files) {
      const filePath = resolve(outputDirectory, file.path);

      await mkdir(dirname(filePath), {
        recursive: true,
      });

      await writeFile(filePath, file.content, "utf8");
    }
  }
}
