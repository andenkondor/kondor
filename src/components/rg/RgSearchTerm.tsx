import { BorderedTextInput } from "@components/BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Focus } from "@definitions/Focus";
import type { ReactNode } from "react";

export const RgSearchTerm = (): ReactNode => {
	const {
		rgState: { searchTerm },
		setRgState,
		setFocusState,
		focusState: { currentFocus },
	} = useApplicationState();
	const hasFocus = currentFocus === Focus.RG;

	const onSearchTermChange = (searchTerm: string) => {
		setRgState((prev) => ({ ...prev, searchTerm: searchTerm.trim() }));
	};

	return (
		<BorderedTextInput
			input={searchTerm}
			onInputChange={onSearchTermChange}
			hasFocus={hasFocus}
			titles={["rg", ...(!hasFocus ? ["⌃G"] : [])]}
			onMouseDown={() =>
				setFocusState((prev) => ({ ...prev, currentFocus: Focus.RG }))
			}
		/>
	);
};
