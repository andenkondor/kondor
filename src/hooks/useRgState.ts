import type { SearchResult } from "@definitions/SearchResult";
import type { RgOptions } from "@tools/Rg";
import { useState } from "react";

export type RgState = {
	searchTerm: string;
	searchResults: SearchResult[];
	isLoading?: boolean;
	rgOptions: RgOptions;
	refreshTrigger: number;
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
		refreshTrigger: 0,
	});

	const cycleRgCase = () => {
		setRgState((prev) => {
			const newCase =
				prev.rgOptions.case === "--smart-case"
					? "--case-sensitive"
					: "--smart-case";
			return {
				...prev,
				rgOptions: { ...prev.rgOptions, case: newCase },
			};
		});
	};

	const cycleRgWordRegexp = () => {
		setRgState((prev) => ({
			...prev,
			rgOptions: {
				...prev.rgOptions,
				wordRegexp: !prev.rgOptions.wordRegexp,
			},
		}));
	};

	const cycleRgResultsPerFile = () => {
		setRgState((prev) => ({
			...prev,
			rgOptions: {
				...prev.rgOptions,
				resultsPerFile: prev.rgOptions.resultsPerFile ? undefined : 1,
			},
		}));
	};

	const cycleRgSingleMatchPerResult = () => {
		setRgState((prev) => ({
			...prev,
			rgOptions: {
				...prev.rgOptions,
				singleMatchPerResult: !prev.rgOptions.singleMatchPerResult,
			},
		}));
	};

	const cycleRgUnrestricted = () => {
		setRgState((prev) => ({
			...prev,
			rgOptions: {
				...prev.rgOptions,
				unrestricted: (prev.rgOptions.unrestricted + 1) % 3,
			},
		}));
	};

	return {
		rgState,
		setRgState,
		cycleRgCase,
		cycleRgWordRegexp,
		cycleRgResultsPerFile,
		cycleRgSingleMatchPerResult,
		cycleRgUnrestricted,
	};
};
