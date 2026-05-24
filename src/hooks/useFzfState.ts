import { useState } from "react";
import type { SearchResult } from "@definitions/SearchResult";
import type { FzfOptions } from "@tools/Fzf";

export type FzfState = {
  filterTerm: string;
  filterResults: SearchResult[];
  fzfOptions: FzfOptions;
  isLoading?: boolean;
};

export const useFzfState = () => {
  const [fzfState, setFzfState] = useState<FzfState>({
    filterTerm: "",
    filterResults: [],
    fzfOptions: { filterColumn: "all" },
  });

  return { fzfState, setFzfState };
};
