import type { SearchResult } from "@definitions/SearchResult";

export class Fzf {
  static execute(input: SearchResult[], filterTerm: string) {
    const stdin = input.map((rg) => `${rg.id}:${rg.lineContent}`).join("\n");
    const proc = Bun.spawn(
      [
        "fzf",
        ...["--accept-nth", "1..2"],
        ...["--with-nth", "1.."],
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
      return input.filter((rg) => filtered.has(rg.id));
    };

    return { proc, getResult };
  }
}
