import type { SearchResult } from "@definitions/SearchResult";
import { $ } from "bun";
import { useEffect, useState } from "react";
import { useConfig } from "@contexts/ConfigContext";

const DEBOUNCE_DELAY = 100;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useRg() {
  const { initialSearchTerm } = useConfig();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm ?? "");
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  useEffect(() => {
    const search = async () => {
      if (!debouncedSearchTerm) {
        setSearchResult([]);
        return;
      }

      try {
        const result = (
          (
            await $`rg --column --fixed-strings --line-number --no-heading --smart-case --color=always --json ${debouncedSearchTerm} | jq -s '.'`.json()
          ).filter(isRgMatch) as unknown as RgMatch[]
        ).map(({ data }) => ({
          id: `${data.path.text}:${data.line_number}`,
          filePath: data.path.text,
          lineContent: data.lines.text.trimEnd(),
          lineNumber: data.line_number,
          subMatches: data.submatches,
        }));

        setSearchResult(result);
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
