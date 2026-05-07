import type { SearchResult } from "@definitions/SearchResult";
import { $ } from "bun";
import { useEffect, useState } from "react";
import { useDebounce } from "@hooks/useDebounce";
import { useConfig } from "@contexts/ConfigContext";

export function useFzf(rgInput: SearchResult[]) {
  const { inputDebounceDelayMs } = useConfig();
  const [fzfFilter, setFzfFilter] = useState("");
  const [output, setOutput] = useState<SearchResult[]>([]);

  const debouncedFzfFilter = useDebounce(fzfFilter, inputDebounceDelayMs);

  useEffect(() => {
    const search = async () => {
      if (!rgInput.length) {
        setOutput([]);
        return;
      }

      if (!debouncedFzfFilter) {
        setOutput(rgInput);
        return;
      }

      try {
        const fzfInput = rgInput
          .map((rg) => `${rg.id}:${rg.lineContent}`)
          .join("\n");

        const result = (
          await $`echo ${Buffer.from(fzfInput).toString("base64")} | base64 -d | fzf --accept-nth=1..2 --delimiter=':' --with-nth=1.. -f ${debouncedFzfFilter}`.text()
        ).split("\n");

        setOutput(rgInput.filter((i) => result.some((r) => r === i.id)));
      } catch (e) {
        setOutput([]);
      }
    };

    search();
  }, [rgInput, debouncedFzfFilter]);

  return { fzfFilter, setFzfFilter, output };
}
