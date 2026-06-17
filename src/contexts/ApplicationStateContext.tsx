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
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

const PREVIEW_DEBOUNCE_DELAY_MS = 100;

type ResultState = {
	overallResults: SearchResult[];
	isLoading: boolean;
	error: string | undefined;
};

type Setter<T> = (updater: (prev: T) => T) => void;

type RgCycleMethods = {
	cycleRgCase: () => void;
	cycleRgWordRegexp: () => void;
	cycleRgResultsPerFile: () => void;
	cycleRgSingleMatchPerResult: () => void;
	cycleRgUnrestricted: () => void;
};

type FzfCycleMethods = {
	cycleFzfFilterColumn: () => void;
	cycleFzfIsExact: () => void;
};

type ApplicationState = {
	rgState: RgState;
	setRgState: Setter<RgState>;
	fzfState: FzfState;
	setFzfState: Setter<FzfState>;
	resultState: ResultState;
	setResultState: Setter<ResultState>;
	focusState: FocusState;
	setFocusState: Setter<FocusState>;
	selectionState: SelectionState;
	setSelectionState: Setter<SelectionState>;
	layoutState: LayoutState;
	setLayoutState: Setter<LayoutState>;
} & RgCycleMethods &
	FzfCycleMethods;

const ApplicationStateContext = createContext<ApplicationState | null>(null);

export const ApplicationStateProvider = ({
	children,
}: {
	children: ReactNode;
}): ReactNode => {
	const { width } = useTerminalDimensions();
	const { initialSearchTerm, preview } = useConfig();

	const {
		rgState,
		setRgState,
		cycleRgCase,
		cycleRgWordRegexp,
		cycleRgResultsPerFile,
		cycleRgSingleMatchPerResult,
		cycleRgUnrestricted,
	} = useRgState(initialSearchTerm);
	const { fzfState, setFzfState, cycleFzfFilterColumn, cycleFzfIsExact } =
		useFzfState();
	const { focusState, setFocusState } = useFocusState();
	const { selectionState, setSelectionState, overallResults } =
		useSelectionState(
			fzfState.filterResults,
			rgState.searchTerm,
			PREVIEW_DEBOUNCE_DELAY_MS,
		);
	const { layoutState, setLayoutState } = useLayoutState(
		width,
		preview.showOnStart,
		preview.layout,
	);

	const [error, setError] = useState<string | undefined>(undefined);

	const resultState: ResultState = useMemo(
		() => ({
			overallResults,
			isLoading: Boolean(rgState.isLoading || fzfState.isLoading),
			error,
		}),
		[overallResults, rgState.isLoading, fzfState.isLoading, error],
	);

	const setResultState = useCallback(
		(updater: (prev: ResultState) => ResultState) =>
			setError(
				(prevError) =>
					updater({
						overallResults: [],
						isLoading: false,
						error: prevError,
					}).error,
			),
		[],
	);

	return (
		<ApplicationStateContext.Provider
			value={{
				rgState,
				setRgState,
				fzfState,
				setFzfState,
				resultState,
				setResultState,
				focusState,
				setFocusState,
				selectionState,
				setSelectionState,
				layoutState,
				setLayoutState,
				cycleRgCase,
				cycleRgWordRegexp,
				cycleRgResultsPerFile,
				cycleRgSingleMatchPerResult,
				cycleRgUnrestricted,
				cycleFzfFilterColumn,
				cycleFzfIsExact,
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
