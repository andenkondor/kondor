import { InputFocus } from "@definitions/Focus";
import { useState } from "react";

export type FocusState = {
	currentFocus: InputFocus;
};

export const useFocusState = () => {
	const [focusState, setFocusState] = useState<FocusState>({
		currentFocus: InputFocus.RG,
	});

	return { focusState, setFocusState };
};
