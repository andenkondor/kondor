import { useRef, type FC } from "react";
import { Text } from "ink";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { TitledBox } from "@mishieck/ink-titled-box";
import { useConfig } from "@contexts/ConfigContext";

export const FzfFilterColumn: FC = () => {
  const {
    colors: { highlightedBorder },
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
    <TitledBox
      titles={["⌥3"]}
      borderStyle={"single"}
      borderColor={isInit ? undefined : highlightedBorder}
    >
      <Text>{display}</Text>
    </TitledBox>
  );
};
