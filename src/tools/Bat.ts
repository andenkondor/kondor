import { spawnSync } from "bun";

type BatOptions = {
  highlightedLine: number;
  fromLine: number;
};

export class Bat {
  static show(filePath: string, { highlightedLine, fromLine }: BatOptions) {
    return spawnSync([
      "bat",
      "--squeeze-blank",
      ...["--highlight-line", highlightedLine.toString()],
      ...["--color", "always"],
      ...["--line-range", `${fromLine}:`],
      filePath,
    ]).stdout.toString();
  }
}
