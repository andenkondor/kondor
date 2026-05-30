import type { SearchResult } from "@definitions/SearchResult";
import type { RgOptions } from "@tools/Rg";
import { useState } from "react";

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
			unrestricted: 0,
		},
		searchNonce: 0,
	});

	return { rgState, setRgState };
};
