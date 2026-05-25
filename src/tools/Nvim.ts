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

  static async openMultiple(items: SearchResult[], renderer: CliRenderer) {
    renderer.suspend();

    const tmpFile = `/tmp/kondor-quickfix-${Date.now()}.txt`;
    const content = items
      .map(
        (item) =>
          `${item.filePath}:${item.lineNumber}:${item.subMatches[0]!.start + 1}:${item.lineContent.trimEnd()}`,
      )
      .join("\n");

    Bun.write(tmpFile, content);

    spawnSync(["nvim", "+copen", "-q", tmpFile], {
      stdout: "inherit",
      stdin: "inherit",
      stderr: "inherit",
    });

    renderer.resume();
  }
}
