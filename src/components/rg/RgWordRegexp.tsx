import { useRef, type FC } from "react";
import { Text } from "ink";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { TitledBox } from "@mishieck/ink-titled-box";
import { useConfig } from "@contexts/ConfigContext";

export const RgWordRegxp: FC = () => {
  const {
    colors: { highlightedBorder },
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { rgOptions },
  } = useApplicationState();
  const initialRef = useRef(rgOptions.wordRegexp);

  const isInit = initialRef.current === rgOptions.wordRegexp;

  const display = rgOptions.wordRegexp ? "match whole word" : "match any";
  return (
    <TitledBox
      titles={["⌥2"]}
      borderStyle={borderType}
      borderColor={isInit ? undefined : highlightedBorder}
    >
      <Text>{display}</Text>
    </TitledBox>
  );
};
