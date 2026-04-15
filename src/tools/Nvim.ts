import type { SearchResult } from "@definitions/SearchResult";
import { spawnSync } from "bun";

export class Nvim {
  static open(item: SearchResult) {
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

    console.log("tick");
  }
}
