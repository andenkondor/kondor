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
    fzfState: { filterResults },
    setLayoutState,
    setRgState,
  } = useApplicationState();

  useInputInk((input, key) => {
    // Result list navigation
    if (key.upArrow) {
      setSelectionState((prev) => {
        const newIndex = Math.max((prev.selectedResultIndex ?? 0) - 1, 0);
        return {
          ...prev,
          selectedResult: filterResults[newIndex],
          selectedResultIndex: newIndex,
        };
      });
    }

    if (key.downArrow) {
      setSelectionState((prev) => {
        const newIndex = Math.min(
          (prev.selectedResultIndex ?? 0) + 1,
          filterResults.length - 1,
        );
        return {
          ...prev,
          selectedResult: filterResults[newIndex],
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
  });
};
