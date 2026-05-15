import { SearchResult } from "@definitions/SearchResult";

export type RgOptions = {
  case: "--smart-case" | "--case-sensitive";
  wordRegexp: boolean;
  resultsPerFile?: number;
};

export class Rg {
  static execute(searchTerm: string, options: RgOptions) {
    const proc = Bun.spawn(
      [
        "rg",
        "--column",
        "--fixed-strings",
        "--line-number",
        "--no-heading",
        "--json",
        options.case,
        ...(options.wordRegexp ? ["--word-regexp"] : []),
        ...(options.resultsPerFile != null
          ? ["--max-count", String(options.resultsPerFile)]
          : []),
        searchTerm,
      ],
      {
        stdout: "pipe",
        stderr: "inherit",
      },
    );

    const getResult = async () => {
      const rgOutput = await new Response(proc.stdout).text();

      const rgMatches = Bun.JSONL.parse(rgOutput).filter(
        isRgMatch,
      ) as unknown as RgMatch[];

      return rgMatches.map(
        (match) => new SearchResult(match.data, { searchTerm, options }),
      );
    };

    return { proc, getResult };
  }
}

type RgMatch = {
  type: "match";
  data: {
    path: { text: string };
    lines: { text: string };
    line_number: number;
    absolute_offset: number;
    submatches: {
      match: { text: string };
      start: number;
      end: number;
    }[];
  };
};

const isRgMatch = (obj: unknown): obj is RgMatch =>
  typeof obj === "object" &&
  obj !== null &&
  "type" in obj &&
  (obj as any).type === "match";
