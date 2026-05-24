import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { BorderStyle } from "@opentui/core";

export type Config = {
  initialSearchTerm?: string;
  inputDebounceDelayMs: number;
  previewDebounceDelayMs: number;
  colors: {
    filePathText: string;
    highlightedText: string;
    normalText: string;
    selectedBackground: string;
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

export const ConfigProvider = ({
  value,
  children,
}: {
  value: Config;
  children: ReactNode;
}): ReactNode => {
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
