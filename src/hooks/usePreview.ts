import { useEffect, useState } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Bat } from "@tools/Bat";

export const usePreview = (previewHeight: number = 0) => {
  const {
    layoutState: { isPreview },
    selectionState: { debouncedSelectedResult, selectedResult },
  } = useApplicationState();

  const [content, setContent] = useState("");

  useEffect(() => {
    if (!isPreview || !debouncedSelectedResult) {
      setContent("");
      return;
    }

    if (debouncedSelectedResult.id !== selectedResult?.id) {
      setContent("");
      return;
    }

    const above = Math.floor((previewHeight - 1) / 2);
    const fromLine = Math.max(1, debouncedSelectedResult.lineNumber - above);

    setContent("");
    let isDisposed = false;

    const loadPreview = async () => {
      const nextContent = await Bat.show(debouncedSelectedResult.filePath, {
        highlightedLine: debouncedSelectedResult.lineNumber,
        fromLine,
        toLine: fromLine + 2 * above,
      });

      if (!isDisposed) {
        setContent(nextContent);
      }
    };

    loadPreview();

    return () => {
      isDisposed = true;
    };
  }, [debouncedSelectedResult, isPreview, previewHeight, selectedResult]);

  return content;
};
