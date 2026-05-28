import { type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { useSpinner } from "@hooks/useSpinner";
import { ResultListContent } from "./ResultListContent";

export const ResultList = (): ReactNode => {
  const {
    markSymbol,
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { searchResults },
    resultState: { overallResults, isLoading },
    selectionState: { selectedResultIndex, markedResultIds },
  } = useApplicationState();

  const spinner = useSpinner(isLoading);

  const selectedIndicator = overallResults.length
    ? `#${selectedResultIndex + 1} -- `
    : "";

  const markedIndicator =
    markedResultIds.size > 0 ? ` -- ${markSymbol}${markedResultIds.size}` : "";

  const statusIndicator = `${selectedIndicator}${overallResults.length}/${searchResults.length}${markedIndicator}`;

  return (
    <box
      borderStyle={borderType}
      title={isLoading ? "" : statusIndicator}
      width="100%"
    >
      {isLoading ? (
        <box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <text>{spinner}</text>
        </box>
      ) : (
        <ResultListContent />
      )}
    </box>
  );
};
