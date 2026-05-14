import { spawnSync } from "bun";

type BatOptions = {
  highlightedLine: number;
  fromLine: number;
  toLine: number;
};

export class Bat {
  static show(
    filePath: string,
    { highlightedLine, fromLine, toLine }: BatOptions,
  ) {
    return spawnSync([
      "bat",
      "--squeeze-blank",
      ...["--highlight-line", highlightedLine.toString()],
      ...["--color", "always"],
      ...["--line-range", `${fromLine}:${toLine}`],
      filePath,
    ]).stdout.toString();
  }
}
