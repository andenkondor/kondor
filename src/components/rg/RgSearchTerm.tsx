import { BorderedTextInput } from "@components/BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { InputFocus } from "@definitions/Focus";
import type { ReactNode } from "react";

export const RgSearchTerm = (): ReactNode => {
	const {
		rgState: { searchTerm },
		setRgState,
		setFocusState,
		focusState: { currentFocus },
		layoutState: {
			popups: { isPopupOpen },
		},
	} = useApplicationState();
	const hasFocus = currentFocus === InputFocus.RG;

	const onSearchTermChange = (searchTerm: string) => {
		setRgState((prev) => ({ ...prev, searchTerm: searchTerm.trim() }));
	};

	return (
		<BorderedTextInput
			input={searchTerm}
			onInputChange={onSearchTermChange}
			hasFocus={hasFocus}
			disableInput={isPopupOpen}
			titles={["rg", ...(!hasFocus ? ["⌃G"] : [])]}
			onMouseDown={() =>
				setFocusState((prev) => ({ ...prev, currentFocus: InputFocus.RG }))
			}
		/>
	);
};
