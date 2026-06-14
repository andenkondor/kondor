import { BorderedTextInput } from "@components/BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { InputFocus } from "@definitions/Focus";
import { Platform } from "@tools/platform";
import type { ReactNode } from "react";

export const FzfFilterTerm = (): ReactNode => {
	const {
		fzfState: { filterTerm },
		setFzfState,
		setFocusState,
		focusState: { currentFocus },
		layoutState: {
			popups: { isPopupOpen },
		},
	} = useApplicationState();

	const hasFocus = currentFocus === InputFocus.FZF;
	const onFilterTermChange = (filterTerm: string) => {
		setFzfState((prev) => ({ ...prev, filterTerm: filterTerm.trim() }));
	};

	return (
		<BorderedTextInput
			input={filterTerm}
			onInputChange={onFilterTermChange}
			hasFocus={hasFocus}
			disableInput={isPopupOpen}
			titles={["fzf", ...(!hasFocus ? [`${Platform.getCtrlKey()}+g`] : [])]}
			onMouseDown={() =>
				setFocusState((prev) => ({ ...prev, currentFocus: InputFocus.FZF }))
			}
		/>
	);
};
