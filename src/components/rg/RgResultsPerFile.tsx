import { useRef, type FC } from "react";
import { Text } from "ink";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { TitledBox } from "@mishieck/ink-titled-box";
import { useConfig } from "@contexts/ConfigContext";

export const RgResultsPerFile: FC = () => {
  const {
    colors: { highlightedBorder },
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { rgOptions },
  } = useApplicationState();
  const initialRef = useRef(rgOptions.resultsPerFile);

  const infinity = "\u221E";
  const isInit = initialRef.current === rgOptions.resultsPerFile;

  const resultsPerFile =
    rgOptions.resultsPerFile != null
      ? String(rgOptions.resultsPerFile)
      : infinity;
  return (
    <TitledBox
      titles={["⌥3"]}
      borderStyle={borderType}
      borderColor={isInit ? undefined : highlightedBorder}
    >
      <Text>{`results/file: ${resultsPerFile}`}</Text>
    </TitledBox>
  );
};
