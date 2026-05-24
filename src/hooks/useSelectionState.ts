import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "@hooks/useDebounce";
import type { SearchResult } from "@definitions/SearchResult";

export type SelectionState = {
  selectedResult?: SearchResult;
  selectedResultIndex: number;
  previewedResult?: SearchResult;
  ignoredResultIds: Set<string>;
};

export const useSelectionState = (
  filterResults: SearchResult[],
  searchTerm: string,
  searchResults: SearchResult[],
  previewDebounceDelayMs: number,
) => {
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);
  const [ignoredResultIds, setIgnoredResultIds] = useState<Set<string>>(
    new Set(),
  );

  const overallResults = useMemo(
    () =>
      filterResults.filter(({ id }) => !ignoredResultIds.has(id.toString())),
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

  useEffect(() => {
    setSelectedResultIndex(0);
  }, [filterResults]);

  const prevSearchTermRef = useRef(searchTerm);
  useEffect(() => {
    if (searchTerm === prevSearchTermRef.current) {
      return;
    }

    prevSearchTermRef.current = searchTerm;
    setIgnoredResultIds(new Set());
  }, [searchResults]);

  const setSelectionState = (
    updater: (prev: SelectionState) => SelectionState,
  ) => {
    const prev: SelectionState = {
      selectedResult,
      selectedResultIndex,
      previewedResult,
      ignoredResultIds,
    };
    const next = updater(prev);
    setSelectedResultIndex(next.selectedResultIndex);
    setIgnoredResultIds(next.ignoredResultIds);
  };

  return {
    selectionState: {
      selectedResult,
      selectedResultIndex,
      previewedResult,
      ignoredResultIds,
    },
    setSelectionState,
    overallResults,
  };
};
