import type { BorderStyle } from "@mishieck/ink-titled-box";
import type { FC, ReactNode } from "react";
import { createContext, useContext } from "react";

export type Config = {
  initialSearchTerm?: string;
  inputDebounceDelayMs: number;
  colors: {
    filePathText: string;
    highlightedText: string;
    normalText: string;
    selectedBackground: string;
    unselectedBackground: string;
    focusedBorder: string;
    highlightedBorder: string;
    unfocusedBorder: string;
    fileLineNumber: string;
    defaultText: string;
    truncationText: string;
  };
  layout: { borderType: BorderStyle };
};

export type CliConfig = Pick<Config, "initialSearchTerm">;

const ConfigContext = createContext<Config | null>(null);

export const ConfigProvider: FC<{ value: Config; children: ReactNode }> = ({
  value,
  children,
}) => {
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
