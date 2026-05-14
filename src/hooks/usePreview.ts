import { useMemo } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Bat } from "@tools/Bat";

export const usePreview = (previewHeight: number) => {
  const {
    layoutState: { isPreview },
    selectionState: { debouncedSelectedResult, selectedResult },
  } = useApplicationState();

  const content = useMemo(() => {
    if (!isPreview || !debouncedSelectedResult) {
      return "";
    }

    if (debouncedSelectedResult.id !== selectedResult?.id) {
      return "";
    }

    const above = Math.floor((previewHeight - 1) / 2);
    const fromLine = Math.max(1, debouncedSelectedResult.lineNumber - above);

    return Bat.show(debouncedSelectedResult.filePath, {
      highlightedLine: debouncedSelectedResult.lineNumber,
      fromLine,
      toLine: fromLine + 2 * above,
    });
  }, [debouncedSelectedResult, isPreview, previewHeight, selectedResult]);

  return content;
};
