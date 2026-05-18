import type { SearchResult } from "@definitions/SearchResult";
import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useConfig } from "@contexts/ConfigContext";
import { Focus } from "@definitions/Focus";
import type { RgOptions } from "@tools/Rg";
import type { FzfOptions } from "@tools/Fzf";
import { useDeepDebounce } from "@hooks/useDebounce";

type FocusState = {
  currentFocus: Focus;
};

type FzfState = {
  filterTerm: string;
  filterResults: SearchResult[];
  fzfOptions: FzfOptions;
  isLoading?: boolean;
};

type RgState = {
  searchTerm: string;
  searchResults: SearchResult[];
  isLoading?: boolean;
  rgOptions: RgOptions;
};

type ResultState = {
  overallResults: SearchResult[];
};

type SelectionState = {
  selectedResult?: SearchResult;
  selectedResultIndex: number;
  debouncedSelectedResult?: SearchResult;
  ignoredResultIds: Set<string>;
};

type LayoutState = {
  isPreview: boolean;
};

type ApplicationState = {
  rgState: RgState;
  setRgState: React.Dispatch<React.SetStateAction<RgState>>;
  fzfState: FzfState;
  setFzfState: React.Dispatch<React.SetStateAction<FzfState>>;
  resultState: ResultState;
  focusState: FocusState;
  setFocusState: React.Dispatch<React.SetStateAction<FocusState>>;
  selectionState: SelectionState;
  setSelectionState: React.Dispatch<React.SetStateAction<SelectionState>>;
  layoutState: LayoutState;
  setLayoutState: React.Dispatch<React.SetStateAction<LayoutState>>;
};

const ApplicationStateContext = createContext<ApplicationState | null>(null);

export const ApplicationStateProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { initialSearchTerm, inputDebounceDelayMs } = useConfig();

  const [fzfState, setFzfState] = useState<FzfState>({
    filterTerm: "",
    filterResults: [],
    fzfOptions: { filterColumn: "all" },
  });

  const [rgState, setRgState] = useState<RgState>({
    searchTerm: initialSearchTerm ?? "",
    searchResults: [],
    rgOptions: { case: "--smart-case", wordRegexp: false },
  });

  const [focusState, setFocusState] = useState<FocusState>({
    currentFocus: Focus.RG,
  });

  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedResultIndex: 0,
    ignoredResultIds: new Set(),
  });

  const [layoutState, setLayoutState] = useState<LayoutState>({
    isPreview: false,
  });

  const overallResults = useMemo(
    () =>
      fzfState.filterResults.filter(
        ({ id }) => !selectionState.ignoredResultIds.has(id.toString()),
      ),
    [fzfState.filterResults, selectionState.ignoredResultIds],
  );

  const selectedResult = useMemo(
    () => overallResults[selectionState.selectedResultIndex],
    [overallResults, selectionState.selectedResultIndex],
  );

  const debouncedSelectedResult = useDeepDebounce(
    selectedResult,
    inputDebounceDelayMs,
  );

  const resultState: ResultState = useMemo(
    () => ({ overallResults }),
    [overallResults],
  );

  useEffect(() => {
    setSelectionState((prev) => ({
      ...prev,
      selectedResultIndex: Math.min(
        prev.selectedResultIndex,
        Math.max(0, overallResults.length - 1),
      ),
    }));
  }, [overallResults.length]);

  useEffect(() => {
    setSelectionState((prev) => ({
      ...prev,
      selectedResultIndex: 0,
    }));
  }, [fzfState.filterResults]);

  useEffect(() => {
    setSelectionState((prev) => ({
      ...prev,
      ignoredResultIds: new Set<string>(),
    }));
  }, [rgState.searchResults]);

  return (
    <ApplicationStateContext.Provider
      value={{
        rgState,
        setRgState,
        fzfState,
        setFzfState,
        resultState,
        focusState,
        setFocusState,
        selectionState: {
          ...selectionState,
          selectedResult,
          debouncedSelectedResult,
        },
        setSelectionState,
        layoutState,
        setLayoutState,
      }}
    >
      {children}
    </ApplicationStateContext.Provider>
  );
};

export const useApplicationState = () => {
  const context = useContext(ApplicationStateContext);
  if (!context) {
    throw new Error(
      "useApplicationState must be used within a ApplicationStateProvider",
    );
  }
  return context;
};
