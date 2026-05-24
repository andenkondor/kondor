import { type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { ResultListContent } from "./ResultListContent";

export const ResultList = (): ReactNode => {
  const {
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { searchResults, isLoading: isRgLoading },
    fzfState: { isLoading: isFzfLoading },
    resultState: { overallResults },
    selectionState: { selectedResultIndex },
  } = useApplicationState();

  const isLoading = isFzfLoading || isRgLoading;
  const fzfResultIndicator = isLoading ? "?" : overallResults.length;
  const rgResultIndicator = isRgLoading ? "?" : searchResults.length;

  const selectedIndicator = overallResults.length
    ? `#${selectedResultIndex + 1} -- `
    : "";

  const statusIndicator = `${selectedIndicator}${fzfResultIndicator}/${rgResultIndicator}`;

  return (
    <box borderStyle={borderType} title={statusIndicator} width="100%">
      <ResultListContent />
    </box>
  );
};
