import type { SearchResult } from "@definitions/SearchResult";
import { $ } from "bun";
import { useEffect, useState } from "react";

export function useFzf(rgInput: SearchResult[]) {
  const [fzfFilter, setFzfFilter] = useState("");
  const [output, setOutput] = useState<SearchResult[]>([]);

  useEffect(() => {
    const search = async () => {
      if (!rgInput.length) {
        setOutput([]);
        return;
      }

      if (!fzfFilter) {
        setOutput(rgInput);
        return;
      }

      try {
        const fzfInput = rgInput
          .map((rg) => `${rg.id}:${rg.lineContent}`)
          .join("\n");

        const result = (
          await $`echo ${Buffer.from(fzfInput).toString("base64")} | base64 -d | fzf --accept-nth=1.. --delimiter=':' --with-nth=1.. -f ${fzfFilter}`.text()
        ).split("\n");

        setOutput(rgInput.filter((i) => result.some((r) => r === i.id)));
      } catch (e) {
        setOutput([]);
      }
    };

    search();
  }, [rgInput, fzfFilter]);

  return { fzfFilter, setFzfFilter, output };
}
