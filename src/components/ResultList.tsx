import { type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { ResultListContent } from "./ResultListContent";

export const ResultList = (): ReactNode => {
  const {
    markSymbol,
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { searchResults, isLoading: isRgLoading },
    fzfState: { isLoading: isFzfLoading },
    resultState: { overallResults },
    selectionState: { selectedResultIndex, markedResultIds },
  } = useApplicationState();

  const isLoading = isFzfLoading || isRgLoading;
  const fzfResultIndicator = isLoading ? "?" : overallResults.length;
  const rgResultIndicator = isRgLoading ? "?" : searchResults.length;

  const selectedIndicator = overallResults.length
    ? `#${selectedResultIndex + 1} -- `
    : "";

  const markedIndicator =
    markedResultIds.size > 0 ? ` -- ${markSymbol}${markedResultIds.size}` : "";

  const statusIndicator = `${selectedIndicator}${fzfResultIndicator}/${rgResultIndicator}${markedIndicator}`;

  return (
    <box borderStyle={borderType} title={statusIndicator} width="100%">
      <ResultListContent />
    </box>
  );
};
