import { useRef, type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";

export const RgCase = (): ReactNode => {
  const {
    colors: { highlightedBorder },
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { rgOptions },
  } = useApplicationState();
  const initialRef = useRef(rgOptions.case);

  const isInit = initialRef.current === rgOptions.case;
  const display =
    rgOptions.case === "--smart-case" ? "smart case" : "case sensitive";
  return (
    <box
      title={"⌥1"}
      borderStyle={borderType}
      borderColor={isInit ? undefined : highlightedBorder}
    >
      <text>{display}</text>
    </box>
  );
};
