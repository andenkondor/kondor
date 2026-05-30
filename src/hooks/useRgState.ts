import { useState } from "react";
import type { SearchResult } from "@definitions/SearchResult";
import type { RgOptions } from "@tools/Rg";

export type RgState = {
  searchTerm: string;
  searchResults: SearchResult[];
  isLoading?: boolean;
  rgOptions: RgOptions;
  searchNonce: number;
};

export const useRgState = (initialSearchTerm: string) => {
  const [rgState, setRgState] = useState<RgState>({
    searchTerm: initialSearchTerm,
    searchResults: [],
    rgOptions: {
      case: "--smart-case",
      wordRegexp: false,
      singleMatchPerResult: false,
    },
    searchNonce: 0,
  });

  return { rgState, setRgState };
};
