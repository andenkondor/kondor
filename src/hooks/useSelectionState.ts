import type { SearchResult } from "@definitions/SearchResult";
import { useDebounce } from "@hooks/useDebounce";
import { useEffect, useMemo, useRef, useState } from "react";

export type SelectionState = {
	selectedResult?: SearchResult;
	selectedResultIndex: number;
	previewedResult?: SearchResult;
	ignoredResultIds: Set<string>;
	markedResultIds: Set<string>;
};

export const useSelectionState = (
	filterResults: SearchResult[],
	searchTerm: string,
	previewDebounceDelayMs: number,
) => {
	const [selectedResultIndex, setSelectedResultIndex] = useState(0);
	const [ignoredResultIds, setIgnoredResultIds] = useState<Set<string>>(
		new Set(),
	);
	const [markedResultIds, setMarkedResultIds] = useState<Set<string>>(
		new Set(),
	);

	const overallResults = useMemo(
		() => filterResults.filter(({ id }) => !ignoredResultIds.has(id)),
		[filterResults, ignoredResultIds],
	);

	const selectedResult = useMemo(
		() => overallResults[selectedResultIndex],
		[overallResults, selectedResultIndex],
	);

	const previewedResult = useDebounce(selectedResult, previewDebounceDelayMs);

	useEffect(() => {
		setSelectedResultIndex((prev) =>
			Math.min(prev, Math.max(0, overallResults.length - 1)),
		);
	}, [overallResults.length]);

	const prevSearchTermRef = useRef(searchTerm);
	useEffect(() => {
		if (searchTerm === prevSearchTermRef.current) {
			return;
		}

		prevSearchTermRef.current = searchTerm;
		setIgnoredResultIds(new Set());
	}, [searchTerm]);

	const setSelectionState = (
		updater: (prev: SelectionState) => SelectionState,
	) => {
		const prev: SelectionState = {
			selectedResult,
			selectedResultIndex,
			previewedResult,
			ignoredResultIds,
			markedResultIds,
		};
		const next = updater(prev);
		setSelectedResultIndex(next.selectedResultIndex);
		setIgnoredResultIds(next.ignoredResultIds);
		setMarkedResultIds(next.markedResultIds);
	};

	return {
		selectionState: {
			selectedResult,
			selectedResultIndex,
			previewedResult,
			ignoredResultIds,
			markedResultIds,
		},
		setSelectionState,
		overallResults,
	};
};
