import { useEffect, useState, useRef } from "react";
import { useConfig } from "@contexts/ConfigContext";
import { useDebounce } from "@hooks/useDebounce";
import { Rg } from "@tools/Rg";
import type { SearchResult } from "@definitions/SearchResult";

export function useRg() {
  const { inputDebounceDelayMs } = useConfig();
  const { initialSearchTerm } = useConfig();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm ?? "");
  const [searchResult, setSearchResult] = useState<SearchResult[]>([]);
  const rgProcRef = useRef<Bun.Subprocess | undefined>(undefined);
  const activeSearchRef = useRef(0);
  const debouncedSearchTerm = useDebounce(searchTerm, inputDebounceDelayMs);

  useEffect(() => {
    const searchId = ++activeSearchRef.current;

    const search = async () => {
      if (rgProcRef.current) {
        rgProcRef.current.kill();
        rgProcRef.current = undefined;
      }

      if (!debouncedSearchTerm) {
        if (searchId === activeSearchRef.current) {
          setSearchResult([]);
        }
        return;
      }

      try {
        const { proc: newRgProc, getResult } = Rg.execute(debouncedSearchTerm);
        rgProcRef.current = newRgProc;

        if (searchId !== activeSearchRef.current) {
          return;
        }
        const searchResult = await getResult();

        if (searchId === activeSearchRef.current) {
          setSearchResult(searchResult);
        }
      } catch (e) {
        if (searchId === activeSearchRef.current) {
          setSearchResult([]);
        }
      }
    };

    search();

    return () => {
      if (rgProcRef.current) {
        rgProcRef.current.kill();
        rgProcRef.current = undefined;
      }
    };
  }, [debouncedSearchTerm]);

  return { searchResult, setSearchTerm, searchTerm };
}
