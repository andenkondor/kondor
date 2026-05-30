import { useConfig } from "@contexts/ConfigContext";
import type { SearchResult } from "@definitions/SearchResult";
import type { FocusState } from "@hooks/useFocusState";
import { useFocusState } from "@hooks/useFocusState";
import type { FzfState } from "@hooks/useFzfState";
import { useFzfState } from "@hooks/useFzfState";
import type { LayoutState } from "@hooks/useLayoutState";
import { useLayoutState } from "@hooks/useLayoutState";
import type { RgState } from "@hooks/useRgState";
import { useRgState } from "@hooks/useRgState";
import type { SelectionState } from "@hooks/useSelectionState";
import { useSelectionState } from "@hooks/useSelectionState";
import { useTerminalDimensions } from "@opentui/react";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

type ResultState = {
	overallResults: SearchResult[];
	isLoading: boolean;
};

type ApplicationState = {
	rgState: RgState;
	setRgState: React.Dispatch<React.SetStateAction<RgState>>;
	fzfState: FzfState;
	setFzfState: React.Dispatch<React.SetStateAction<FzfState>>;
	resultState: ResultState;
	focusState: FocusState;
	setFocusState: React.Dispatch<React.SetStateAction<FocusState>>;
	selectionState: SelectionState;
	setSelectionState: (
		updater: (prev: SelectionState) => SelectionState,
	) => void;
	layoutState: LayoutState;
	setLayoutState: (updater: (prev: LayoutState) => LayoutState) => void;
};

const ApplicationStateContext = createContext<ApplicationState | null>(null);

export const ApplicationStateProvider = ({
	children,
}: {
	children: ReactNode;
}): ReactNode => {
	const { width } = useTerminalDimensions();
	const { initialSearchTerm, previewDebounceDelayMs } = useConfig();

	const { rgState, setRgState } = useRgState(initialSearchTerm ?? "");
	const { fzfState, setFzfState } = useFzfState();
	const { focusState, setFocusState } = useFocusState();
	const { selectionState, setSelectionState, overallResults } =
		useSelectionState(
			fzfState.filterResults,
			rgState.searchTerm,
			rgState.searchResults,
			previewDebounceDelayMs,
		);
	const { layoutState, setLayoutState } = useLayoutState(width);

	const resultState: ResultState = useMemo(
		() => ({
			overallResults,
			isLoading: Boolean(rgState.isLoading || fzfState.isLoading),
		}),
		[overallResults, rgState.isLoading, fzfState.isLoading],
	);

	return (
		<ApplicationStateContext.Provider
			value={{
				rgState,
				setRgState,
				fzfState,
				setFzfState,
				resultState,
				focusState,
				setFocusState,
				selectionState,
				setSelectionState,
				layoutState,
				setLayoutState,
			}}
		>
			{children}
		</ApplicationStateContext.Provider>
	);
};

export const useApplicationState = () => {
	const context = useContext(ApplicationStateContext);
	if (!context) {
		throw new Error(
			"useApplicationState must be used within a ApplicationStateProvider",
		);
	}
	return context;
};
