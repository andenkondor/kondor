import { type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";

export const RgUnrestricted = (): ReactNode => {
  const {
    colors: { highlightedBorder },
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { rgOptions },
  } = useApplicationState();

  const display = String(rgOptions.unrestricted);
  return (
    <box
      title={"⌥5"}
      borderStyle={borderType}
      borderColor={rgOptions.unrestricted > 0 ? highlightedBorder : undefined}
    >
      <text>{`unrestricted: ${display}`}</text>
    </box>
  );
};
