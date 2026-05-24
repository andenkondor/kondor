import type { ReactNode } from "react";
import { RgControl } from "@components/rg/RgControl";
import { FzfControl } from "@components/fzf/FzfControl";
import { ResultList } from "@components/ResultList";
import { useInput } from "@hooks/useInput";
import { Preview } from "@components/Preview";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useTerminalDimensions } from "@opentui/react";

export const App = (): ReactNode => {
  useInput();
  const {
    layoutState: { isPreview },
  } = useApplicationState();

  const { width } = useTerminalDimensions();

  return (
    <box flexDirection="column">
      <box flexGrow={0} flexShrink={0} flexBasis={3}>
        <RgControl />
      </box>
      <box flexGrow={0} flexShrink={0} flexBasis={3}>
        <FzfControl />
      </box>
      <box flexGrow={1}>
        <box flexDirection="row">
          <box flexBasis={width}>
            <ResultList />
          </box>
          {isPreview && (
            <box flexBasis={width}>
              <Preview />
            </box>
          )}
        </box>
      </box>
    </box>
  );
};
