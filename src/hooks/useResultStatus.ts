import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";

type ResultStatus = {
  statusIndicator: string;
};

export const useResultStatus = (): ResultStatus => {
  const { markSymbol } = useConfig();
  const {
    rgState: { searchResults },
    resultState: { overallResults, isLoading },
    selectionState: { selectedResultIndex, markedResultIds },
  } = useApplicationState();

  const parts: string[] = [];

  if (isLoading) {
    parts.push("#?", "?/?");
  } else {
    if (overallResults.length) {
      parts.push(`#${selectedResultIndex + 1}`);
    }
    parts.push(`${overallResults.length}/${searchResults.length}`);
  }

  if (markedResultIds.size > 0) {
    parts.push(`${markSymbol}${markedResultIds.size}`);
  }

  const statusIndicator = parts.join(" -- ");

  return { statusIndicator };
};
