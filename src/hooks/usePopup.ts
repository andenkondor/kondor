import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Focus } from "@definitions/Focus";
import { useKeyboard } from "@opentui/react";
import { useState } from "react";

const closePopup = (
	setLayoutState: ReturnType<typeof useApplicationState>["setLayoutState"],
	setFocusState: ReturnType<typeof useApplicationState>["setFocusState"],
	setSelectedIndex: (index: number) => void,
) => {
	setLayoutState((prev) => ({
		...prev,
		popups: { ...prev.popups, isChooseOpenerPopupOpen: false },
	}));
	setFocusState((prev) => ({ ...prev, currentFocus: Focus.RG }));
	setSelectedIndex(0);
};

export const usePopup = (
	maxIndex: number,
	onEnter: (index: number) => void,
	onNumber?: (index: number) => void,
) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const {
		setLayoutState,
		setFocusState,
		layoutState: {
			popups: { isChooseOpenerPopupOpen },
		},
	} = useApplicationState();

	useKeyboard((key) => {
		if (!isChooseOpenerPopupOpen) {
			return;
		}

		if (key.name === "escape") {
			closePopup(setLayoutState, setFocusState, setSelectedIndex);
			return;
		}

		if (key.name === "up") {
			setSelectedIndex((prev) => Math.max(prev - 1, 0));
			return;
		}

		if (key.name === "down") {
			setSelectedIndex((prev) => Math.min(prev + 1, maxIndex));
			return;
		}

		if (key.name === "return") {
			onEnter(selectedIndex);
			closePopup(setLayoutState, setFocusState, setSelectedIndex);
			return;
		}

		const n = Number(key.name);
		if (n >= 1 && n <= 9) {
			const index = n - 1;
			if (index <= maxIndex) {
				(onNumber ?? onEnter)(index);
				closePopup(setLayoutState, setFocusState, setSelectedIndex);
			}
		}
	});

	return { selectedIndex, isChooseOpenerPopupOpen };
};
