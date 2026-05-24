import { useRef, type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";

export const RgSort = (): ReactNode => {
  const {
    colors: { highlightedBorder },
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { rgOptions },
  } = useApplicationState();
  const initialRef = useRef(rgOptions.sort);

  const isInit = initialRef.current === rgOptions.sort;

  const displayBaseline = "sort";
  const display = `${displayBaseline}: ${rgOptions.sort === "path" ? "path" : "random (fast)"}`;
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
