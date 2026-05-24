import { useRef, type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";

export const RgWordRegxp = (): ReactNode => {
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
    <box
      title={"⌥2"}
      borderStyle={borderType}
      borderColor={isInit ? undefined : highlightedBorder}
    >
      <text>{display}</text>
    </box>
  );
};
