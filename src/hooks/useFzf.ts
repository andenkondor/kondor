import { useEffect, useRef } from "react";
import { useDebounce } from "@hooks/useDebounce";
import { useConfig } from "@contexts/ConfigContext";
import { Fzf } from "@tools/Fzf";
import { useApplicationState } from "@contexts/ApplicationStateContext";

export function useFzf() {
  const {
    setFzfState,
    rgState: { searchResults },
    fzfState: { filterTerm, fzfOptions },
  } = useApplicationState();

  const { inputDebounceDelayMs } = useConfig();
  const fzfProcRef = useRef<Bun.Subprocess | undefined>(undefined);
  const activeFilterRef = useRef(0);
  const debouncedFzfFilter = useDebounce(filterTerm, inputDebounceDelayMs);

  useEffect(() => {
    const filterId = ++activeFilterRef.current;

    const search = async () => {
      if (fzfProcRef.current) {
        fzfProcRef.current.kill();
        fzfProcRef.current = undefined;
      }

      if (!searchResults.length) {
        if (filterId === activeFilterRef.current) {
          setFzfState((prev) => ({ ...prev, filterResults: [] }));
        }

        return;
      }

      if (!debouncedFzfFilter) {
        if (filterId === activeFilterRef.current) {
          setFzfState((prev) => ({ ...prev, filterResults: searchResults }));
        }

        return;
      }

      try {
        setFzfState((prev) => ({
          ...prev,
          isLoading: true,
          filterResults: [],
        }));

        const { proc, getResult } = Fzf.execute(
          searchResults,
          debouncedFzfFilter,
          fzfOptions,
        );
        fzfProcRef.current = proc;

        const filterResults = await getResult();

        if (filterId === activeFilterRef.current) {
          setFzfState((prev) => ({
            ...prev,
            filterResults,
          }));
        }
      } finally {
        if (filterId === activeFilterRef.current) {
          setFzfState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      }
    };

    search();
  }, [searchResults, debouncedFzfFilter, fzfOptions]);
}
