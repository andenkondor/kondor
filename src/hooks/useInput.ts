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
    selectionState: { selectedResult, markedResultIds },
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

    if (key.name === "tab") {
      if (!selectedResult) {
        return;
      }
      setSelectionState((prev) => {
        const newSet = new Set(prev.markedResultIds);
        if (newSet.has(selectedResult.id)) {
          newSet.delete(selectedResult.id);
        } else {
          newSet.add(selectedResult.id);
        }
        return {
          ...prev,
          markedResultIds: newSet,
        };
      });
    }

    if (key.ctrl && key.name === "a") {
      setSelectionState((prev) => {
        if (prev.markedResultIds.size > 0) {
          return { ...prev, markedResultIds: new Set() };
        }
        return {
          ...prev,
          markedResultIds: new Set(overallResults.map((r) => r.id)),
        };
      });
    }

    if (key.name === "return") {
      if (markedResultIds.size > 0) {
        const markedItems = overallResults.filter((r) =>
          markedResultIds.has(r.id),
        );

        if (markedItems.length === 1) {
          Nvim.open(markedItems[0]!, renderer);
        } else if (markedItems.length > 1) {
          Nvim.openMultiple(markedItems, renderer);
        }
        return;
      }

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
        ignoredResultIds: new Set(prev.ignoredResultIds).add(selectedResult.id),
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

    // Rg sort
    if (key.meta && key.name === "4") {
      setRgState((prev) => {
        return {
          ...prev,
          rgOptions: {
            ...prev.rgOptions,
            sort: prev.rgOptions.sort === "path" ? "none" : "path",
          },
        };
      });
    }

    // fzf filter column
    if (key.meta && key.name === "5") {
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
