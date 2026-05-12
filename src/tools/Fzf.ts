import type { SearchResult } from "@definitions/SearchResult";

export type FzfOptions = {
  filterColumn: "all" | "filePath" | "lineContent";
};

export class Fzf {
  static execute(
    input: SearchResult[],
    filterTerm: string,
    options: FzfOptions,
  ) {
    const stdin = input
      .map((rg) => `${rg.id}:${rg.filePath}:${rg.lineContent}`)
      .join("\n");

    const withNth =
      options.filterColumn === "all"
        ? "2.."
        : options.filterColumn === "filePath"
          ? "2"
          : "3";

    const proc = Bun.spawn(
      [
        "fzf",
        ...["--accept-nth", "1"],
        ...["--with-nth", withNth],
        ...["--delimiter", ":"],
        ...["-f", filterTerm],
      ],
      {
        stdout: "pipe",
        stderr: "inherit",
        stdin: Buffer.from(stdin),
      },
    );

    const getResult = async () => {
      const fzfOutput = (await new Response(proc.stdout).text()).split("\n");

      const filtered = new Set(fzfOutput);
      return input.filter((rg) => filtered.has(rg.id.toString()));
    };

    return { proc, getResult };
  }
}
