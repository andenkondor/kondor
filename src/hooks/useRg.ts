import type { SearchResult } from "@definitions/SearchResult";
import { $ } from "bun";
import { useEffect, useState } from "react";
import { useConfig } from "@contexts/ConfigContext";
import { useDebounce } from "@hooks/useDebounce";

export function useRg() {
  const { inputDebounceDelayMs } = useConfig();
  const { initialSearchTerm } = useConfig();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm ?? "");
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, inputDebounceDelayMs);

  useEffect(() => {
    const search = async () => {
      if (!debouncedSearchTerm) {
        setSearchResult([]);
        return;
      }

      try {
        const rgOutput =
          await $`rg --column --fixed-strings --line-number --no-heading --smart-case --color=always --json ${debouncedSearchTerm}`.text();
        const rgMatches = Bun.JSONL.parse(rgOutput).filter(
          isRgMatch,
        ) as unknown as RgMatch[];

        const searchResult = rgMatches.map(({ data }) => ({
          id: `${data.path.text}:${data.line_number}`,
          filePath: data.path.text,
          lineContent: data.lines.text.trimEnd(),
          lineNumber: data.line_number,
          subMatches: data.submatches,
        }));

        setSearchResult(searchResult);
      } catch (e) {
        setSearchResult([]);
      }
    };

    search();
  }, [debouncedSearchTerm]);

  return { searchResult, setSearchTerm, searchTerm };
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
