import { useRef, type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";

export const FzfFilterColumn = (): ReactNode => {
  const {
    colors: { highlightedBorder },
    layout: { borderType },
  } = useConfig();
  const {
    fzfState: { fzfOptions },
  } = useApplicationState();
  const initialRef = useRef(fzfOptions.filterColumn);

  const isInit = initialRef.current === fzfOptions.filterColumn;

  const display =
    fzfOptions.filterColumn === "all"
      ? "filter all columns"
      : fzfOptions.filterColumn === "filePath"
        ? "filter file path"
        : "filter line content";
  return (
    <box
      title={"⌥4"}
      borderStyle={borderType}
      borderColor={isInit ? undefined : highlightedBorder}
    >
      <text>{display}</text>
    </box>
  );
};
