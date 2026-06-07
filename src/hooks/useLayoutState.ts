import { useMemo, useState } from "react";

export type PopupsState = {
	isChooseOpenerPopupOpen: boolean;
};

export type LayoutState = {
	isPreview: boolean;
	resultListContentWidth: number;
	popups: PopupsState;
};

const BORDER_THICKNESS = 1;

export const useLayoutState = (width: number) => {
	const [isPreview, setIsPreview] = useState(false);
	const [isChooseOpenerPopupOpen, setIsChooseOpenerPopupOpen] = useState(false);

	const resultListContentWidth = useMemo(
		() => (isPreview ? Math.floor(width / 2) : width) - 2 * BORDER_THICKNESS,
		[isPreview, width],
	);

	const setLayoutState = (updater: (prev: LayoutState) => LayoutState) => {
		const prev: LayoutState = {
			isPreview,
			resultListContentWidth,
			popups: {
				isChooseOpenerPopupOpen,
			},
		};
		const next = updater(prev);
		setIsPreview(next.isPreview);
		setIsChooseOpenerPopupOpen(next.popups.isChooseOpenerPopupOpen);
	};

	return {
		layoutState: {
			isPreview,
			resultListContentWidth,
			popups: {
				isChooseOpenerPopupOpen,
			},
		},
		setLayoutState,
	};
};
