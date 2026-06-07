import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useKeyboard } from "@opentui/react";
import { useState } from "react";

export const usePopup = (
	maxIndex: number,
	onEnter: (index: number) => void,
) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const {
		setLayoutState,
		layoutState: {
			popups: { isChooseOpenerPopupOpen },
		},
	} = useApplicationState();

	useKeyboard((key) => {
		if (!isChooseOpenerPopupOpen) {
			return;
		}

		if (key.name === "escape") {
			setLayoutState((prev) => ({
				...prev,
				popups: { ...prev.popups, isChooseOpenerPopupOpen: false },
			}));
			setSelectedIndex(0);
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
			setLayoutState((prev) => ({
				...prev,
				popups: { ...prev.popups, isChooseOpenerPopupOpen: false },
			}));
			setSelectedIndex(0);
		}
	});

	return { selectedIndex, isChooseOpenerPopupOpen };
};
