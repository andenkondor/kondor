import { Focus } from "@definitions/Focus";
import { useState } from "react";

export type FocusState = {
	currentFocus: Focus;
};

export const useFocusState = () => {
	const [focusState, setFocusState] = useState<FocusState>({
		currentFocus: Focus.RG,
	});

	return { focusState, setFocusState };
};
