import type { SearchResult } from "@definitions/SearchResult";
import type { FC, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useConfig } from "./ConfigContext";
import { Focus } from "@definitions/Focus";

type FocusState = {
  currentFocus: Focus;
};

type FzfState = {
  filterTerm: string;
  filterResults: SearchResult[];
  isLoading?: boolean;
};

type RgState = {
  searchTerm: string;
  searchResults: SearchResult[];
  isLoading?: boolean;
};

type SelectionState = {
  selectedResult?: SearchResult;
  selectedResultIndex: number;
};

type LayoutState = {
  isPreview: boolean;
};

type ApplicationState = {
  rgState: RgState;
  setRgState: React.Dispatch<React.SetStateAction<RgState>>;
  fzfState: FzfState;
  setFzfState: React.Dispatch<React.SetStateAction<FzfState>>;
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
  const { initialSearchTerm } = useConfig();

  const [fzfState, setFzfState] = useState<FzfState>({
    filterTerm: "",
    filterResults: [],
  });

  const [rgState, setRgState] = useState<RgState>({
    searchTerm: initialSearchTerm ?? "",
    searchResults: [],
  });

  const [focusState, setFocusState] = useState<FocusState>({
    currentFocus: Focus.RG,
  });

  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedResultIndex: 0,
  });

  const [layoutState, setLayoutState] = useState<LayoutState>({
    isPreview: false,
  });

  useEffect(() => {
    setSelectionState({
      selectedResultIndex: 0,
      selectedResult: fzfState.filterResults[0],
    });
  }, [fzfState.filterResults]);

  return (
    <ApplicationStateContext.Provider
      value={{
        rgState,
        setRgState,
        fzfState,
        setFzfState,
        focusState,
        setFocusState,
        selectionState,
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
