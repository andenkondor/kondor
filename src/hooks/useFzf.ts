import type { SearchResult } from "@definitions/SearchResult";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@hooks/useDebounce";
import { useConfig } from "@contexts/ConfigContext";
import { Fzf } from "@tools/Fzf";

export function useFzf(rgInput: SearchResult[]) {
  const { inputDebounceDelayMs } = useConfig();
  const [fzfFilter, setFzfFilter] = useState("");
  const [output, setOutput] = useState<SearchResult[]>([]);
  const fzfProcRef = useRef<Bun.Subprocess | undefined>(undefined);
  const activeFilterRef = useRef(0);

  const debouncedFzfFilter = useDebounce(fzfFilter, inputDebounceDelayMs);

  useEffect(() => {
    const filterId = ++activeFilterRef.current;

    const search = async () => {
      if (fzfProcRef.current) {
        fzfProcRef.current.kill();
        fzfProcRef.current = undefined;
      }

      if (!rgInput.length) {
        if (filterId === activeFilterRef.current) {
          setOutput([]);
        }

        return;
      }

      if (!debouncedFzfFilter) {
        if (filterId === activeFilterRef.current) {
          setOutput(rgInput);
        }

        return;
      }

      try {
        const { proc, getResult } = Fzf.execute(rgInput, debouncedFzfFilter);
        fzfProcRef.current = proc;

        if (filterId === activeFilterRef.current) {
          setOutput(await getResult());
        }
      } catch (e) {
        if (filterId === activeFilterRef.current) {
          setOutput([]);
        }
      }
    };

    search();
  }, [rgInput, debouncedFzfFilter]);

  return { fzfFilter, setFzfFilter, output };
}
