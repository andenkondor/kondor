import type { SearchResult } from "@definitions/SearchResult";
import type { CliRenderer } from "@opentui/core";
import { spawnSync } from "bun";

export class Nvim {
  static async open(item: SearchResult, renderer: CliRenderer) {
    renderer.suspend();

    spawnSync(
      [
        "nvim",
        `+call cursor(${item.lineNumber}, ${item.subMatches[0]!.start + 1})`,
        item.filePath,
      ],
      {
        stdout: "inherit",
        stdin: "inherit",
        stderr: "inherit",
      },
    );

    renderer.resume();
  }
}
