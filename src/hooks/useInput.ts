import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Focus } from "@definitions/Focus";
import { useKeyboard, useRenderer } from "@opentui/react";
import { Nvim } from "@tools/Nvim";

export const useInput = () => {
	const renderer = useRenderer();
	const {
		setFocusState,
		setSelectionState,
		selectionState: { selectedResult, markedResultIds },
		setLayoutState,
		setRgState,
		resultState: { overallResults },
		layoutState: {
			popups: { isChooseOpenerPopupOpen },
		},
		cycleRgCase,
		cycleRgWordRegexp,
		cycleRgResultsPerFile,
		cycleRgSingleMatchPerResult,
		cycleRgUnrestricted,
		cycleFzfFilterColumn,
		cycleFzfIsExact,
	} = useApplicationState();

	useKeyboard((key) => {
		if (isChooseOpenerPopupOpen) {
			return;
		}

		// Result list navigation
		if (key.name === "home") {
			key.preventDefault();
			setSelectionState((prev) => ({
				...prev,
				selectedResultIndex: 0,
			}));
		}

		if (key.name === "end") {
			key.preventDefault();
			setSelectionState((prev) => ({
				...prev,
				selectedResultIndex: Math.max(0, overallResults.length - 1),
			}));
		}

		if (key.name === "up" || key.name === "pageup") {
			setSelectionState((prev) => {
				const step = key.name === "pageup" ? 5 : 1;
				const newIndex = Math.max(prev.selectedResultIndex - step, 0);
				return {
					...prev,
					selectedResultIndex: newIndex,
				};
			});
		}

		if (key.name === "down" || key.name === "pagedown") {
			setSelectionState((prev) => {
				const step = key.name === "pagedown" ? 5 : 1;
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

		if (!key.shift && key.name === "return") {
			if (markedResultIds.size > 0) {
				const markedItems = overallResults.filter((r) =>
					markedResultIds.has(r.id),
				);

				if (markedItems.length === 1) {
					const markedItem = markedItems[0];
					if (!markedItem) return;
					Nvim.open(markedItem, renderer);
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

		if (key.shift && key.name === "return") {
			if (!selectedResult) {
				return;
			}

			setLayoutState((prev) => ({
				...prev,
				popups: { ...prev.popups, isChooseOpenerPopupOpen: true },
			}));
			setFocusState((prev) => ({ ...prev, currentFocus: Focus.POPUP }));
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
			setRgState((prev) => ({
				...prev,
				refreshTrigger: prev.refreshTrigger + 1,
			}));
		}

		// Rg case switching
		if (key.meta && key.name === "1") {
			cycleRgCase();
		}

		// Rg word-regexp
		if (key.meta && key.name === "2") {
			cycleRgWordRegexp();
		}

		// Rg max results per file
		if (key.meta && key.name === "3") {
			cycleRgResultsPerFile();
		}

		// Rg matches per result
		if (key.meta && key.name === "4") {
			cycleRgSingleMatchPerResult();
		}

		// Rg unrestricted
		if (key.meta && key.name === "5") {
			cycleRgUnrestricted();
		}

		// fzf filter column
		if (key.meta && key.name === "6") {
			cycleFzfFilterColumn();
		}

		// fzf exact/fuzzy toggle
		if (key.meta && key.name === "7") {
			cycleFzfIsExact();
		}
	});
};
