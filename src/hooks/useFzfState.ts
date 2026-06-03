import type { SearchResult } from "@definitions/SearchResult";
import type { FzfOptions } from "@tools/Fzf";
import { useState } from "react";

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

	const cycleFzfFilterColumn = () => {
		setFzfState((prev) => {
			const filterColumn =
				prev.fzfOptions.filterColumn === "all"
					? "filePath"
					: prev.fzfOptions.filterColumn === "filePath"
						? "lineContent"
						: "all";
			return {
				...prev,
				fzfOptions: { ...prev.fzfOptions, filterColumn },
			};
		});
	};

	const cycleFzfIsExact = () => {
		setFzfState((prev) => ({
			...prev,
			fzfOptions: { ...prev.fzfOptions, isExact: !prev.fzfOptions.isExact },
		}));
	};

	return { fzfState, setFzfState, cycleFzfFilterColumn, cycleFzfIsExact };
};
