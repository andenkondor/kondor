import { useInput as useInputInk } from "ink";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Focus } from "@definitions/Focus";
import { Nvim } from "@tools/Nvim";
import { Idea } from "@tools/Idea";

export const useInput = () => {
  const {
    setFocusState,
    setSelectionState,
    selectionState: { selectedResult },
    setLayoutState,
    setRgState,
    setFzfState,
    resultState: { overallResults },
  } = useApplicationState();

  useInputInk((input, key) => {
    // Result list navigation
    if (key.upArrow || key.pageUp || key.home) {
      setSelectionState((prev) => {
        const step = key.home ? prev.selectedResultIndex : key.pageUp ? 5 : 1;
        const newIndex = Math.max(prev.selectedResultIndex - step, 0);
        return {
          ...prev,
          selectedResultIndex: newIndex,
        };
      });
    }

    if (key.downArrow || key.pageDown || key.end) {
      setSelectionState((prev) => {
        const step = key.end ? overallResults.length : key.pageDown ? 5 : 1;
        const newIndex = Math.min(
          prev.selectedResultIndex + step,
          Math.max(0, overallResults.length - 1),
        );
        return {
          ...prev,
          selectedResultIndex: newIndex,
        };
      });
    }

    if (key.return) {
      if (!selectedResult) {
        return;
      }
      Nvim.open(selectedResult);
    }

    if (key.ctrl && input === "s") {
      if (!selectedResult) {
        return;
      }
      Idea.open(selectedResult);
    }

    // Focus switching
    if (key.ctrl && input === "g") {
      setFocusState((prev) => ({
        ...prev,
        currentFocus: prev.currentFocus === Focus.FZF ? Focus.RG : Focus.FZF,
      }));
    }

    // Preview switching
    if (key.ctrl && input === "p") {
      setLayoutState((prev) => ({
        ...prev,
        isPreview: !prev.isPreview,
      }));
    }

    // Delete item
    if (key.ctrl && input === "x") {
      if (!selectedResult) {
        return;
      }
      setSelectionState((prev) => ({
        ...prev,
        ignoredResultIds: new Set(prev.ignoredResultIds).add(
          selectedResult.id.toString(),
        ),
      }));
    }

    // Refresh rg search
    if (key.ctrl && input === "r") {
      setRgState((prev) => ({ ...prev, searchNonce: prev.searchNonce + 1 }));
    }

    // Rg case switching
    if (key.meta && input === "1") {
      setRgState((prev) => {
        const newCase =
          prev.rgOptions.case === "--smart-case"
            ? "--case-sensitive"
            : "--smart-case";

        return {
          ...prev,
          rgOptions: { ...prev.rgOptions, case: newCase },
        };
      });
    }

    // Rg word-regexp
    if (key.meta && input === "2") {
      setRgState((prev) => {
        return {
          ...prev,
          rgOptions: {
            ...prev.rgOptions,
            wordRegexp: !prev.rgOptions.wordRegexp,
          },
        };
      });
    }

    // Rg max results per file
    if (key.meta && input === "3") {
      setRgState((prev) => {
        return {
          ...prev,
          rgOptions: {
            ...prev.rgOptions,
            resultsPerFile: prev.rgOptions.resultsPerFile ? undefined : 1,
          },
        };
      });
    }

    // fzf filter column
    if (key.meta && input === "4") {
      setFzfState((prev) => {
        const filterColumn =
          prev.fzfOptions.filterColumn === "all"
            ? "filePath"
            : prev.fzfOptions.filterColumn === "filePath"
              ? "lineContent"
              : "all";

        return {
          ...prev,
          fzfOptions: {
            ...prev.fzfOptions,
            filterColumn,
          },
        };
      });
    }
  });
};
