import type { SearchResult } from "@definitions/SearchResult";
import type { FC, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { useConfig } from "./ConfigContext";

type FzfState = {
  filterTerm: string;
  filterResults: SearchResult[];
};

type RgState = {
  searchTerm: string;
  searchResults: SearchResult[];
};

type ApplicationState = {
  rgState: RgState;
  setRgState: React.Dispatch<React.SetStateAction<RgState>>;
  fzfState: FzfState;
  setFzfState: React.Dispatch<React.SetStateAction<FzfState>>;
};

const ApplicationStateContext = createContext<ApplicationState>({
  rgState: { searchTerm: "", searchResults: [] },
  setRgState: () => {},
  fzfState: { filterTerm: "", filterResults: [] },
  setFzfState: () => {},
});

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

  return (
    <ApplicationStateContext.Provider
      value={{ rgState, setRgState, fzfState, setFzfState }}
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
