import { useKeyboard, useRenderer } from "@opentui/react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Focus } from "@definitions/Focus";
import { Nvim } from "@tools/Nvim";
import { Idea } from "@tools/Idea";

export const useInput = () => {
  const renderer = useRenderer();
  const {
    setFocusState,
    setSelectionState,
    selectionState: { selectedResult },
    setLayoutState,
    setRgState,
    setFzfState,
    resultState: { overallResults },
  } = useApplicationState();

  useKeyboard((key) => {
    // Result list navigation
    if (key.name === "up" || key.name === "pageup" || key.name === "home") {
      setSelectionState((prev) => {
        const step =
          key.name === "home"
            ? prev.selectedResultIndex
            : key.name === "pageup"
              ? 5
              : 1;
        const newIndex = Math.max(prev.selectedResultIndex - step, 0);
        return {
          ...prev,
          selectedResultIndex: newIndex,
        };
      });
    }

    if (key.name === "down" || key.name === "pagedown" || key.name === "end") {
      setSelectionState((prev) => {
        const step =
          key.name === "end"
            ? overallResults.length
            : key.name === "pagedown"
              ? 5
              : 1;
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

    if (key.name === "return") {
      if (!selectedResult) {
        return;
      }
      Nvim.open(selectedResult, renderer);
    }

    if (key.ctrl && key.name === "s") {
      if (!selectedResult) {
        return;
      }
      Idea.open(selectedResult);
    }

    // Focus switching
    if (key.ctrl && key.name === "g") {
      setFocusState((prev) => ({
        ...prev,
        currentFocus: prev.currentFocus === Focus.FZF ? Focus.RG : Focus.FZF,
      }));
    }

    // Preview switching
    if (key.ctrl && key.name === "p") {
      setLayoutState((prev) => ({
        ...prev,
        isPreview: !prev.isPreview,
      }));
    }

    // Delete item
    if (key.ctrl && key.name === "x") {
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
    if (key.ctrl && key.name === "r") {
      setRgState((prev) => ({ ...prev, searchNonce: prev.searchNonce + 1 }));
    }

    // Rg case switching
    if (key.meta && key.name === "1") {
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
    if (key.meta && key.name === "2") {
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
    if (key.meta && key.name === "3") {
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
    if (key.meta && key.name === "4") {
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
