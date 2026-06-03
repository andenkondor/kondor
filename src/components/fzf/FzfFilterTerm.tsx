import { BorderedTextInput } from "@components/BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Focus } from "@definitions/Focus";
import type { ReactNode } from "react";

export const FzfFilterTerm = (): ReactNode => {
	const {
		fzfState: { filterTerm },
		setFzfState,
		setFocusState,
		focusState: { currentFocus },
	} = useApplicationState();

	const hasFocus = currentFocus === Focus.FZF;
	const onFilterTermChange = (filterTerm: string) => {
		setFzfState((prev) => ({ ...prev, filterTerm: filterTerm.trim() }));
	};

	return (
		<BorderedTextInput
			input={filterTerm}
			onInputChange={onFilterTermChange}
			hasFocus={hasFocus}
			titles={["fzf", ...(!hasFocus ? ["⌃G"] : [])]}
			onMouseDown={() =>
				setFocusState((prev) => ({ ...prev, currentFocus: Focus.FZF }))
			}
		/>
	);
};
