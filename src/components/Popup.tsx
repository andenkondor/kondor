import { ChooseOpener } from "@components/ChooseOpener";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import type { ReactNode } from "react";

export const Popup = (): ReactNode => {
	const {
		layoutState: {
			popups: { isChooseOpenerPopupOpen },
		},
	} = useApplicationState();
	const {
		colors: { focusedBorder, popupBackgroundColor, popupOverlayColor },
		layout: { borderType },
	} = useConfig();

	if (!isChooseOpenerPopupOpen) {
		return null;
	}

	return (
		<box
			position="absolute"
			top={0}
			left={0}
			width="100%"
			height="100%"
			alignItems="center"
			justifyContent="center"
			backgroundColor={popupOverlayColor}
		>
			<box
				borderStyle={borderType}
				borderColor={focusedBorder}
				backgroundColor={popupBackgroundColor}
				title="Open with"
				width={60}
			>
				<ChooseOpener />
			</box>
		</box>
	);
};
