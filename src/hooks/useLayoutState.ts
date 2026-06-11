import type { PreviewLayout } from "@contexts/ConfigSchema";
import { useMemo, useState } from "react";

export type PopupsState = {
	isChooseOpenerPopupOpen: boolean;
	isPopupOpen: boolean;
};

export type LayoutState = {
	isPreview: boolean;
	previewLayout: PreviewLayout;
	resultListContentWidth: number;
	popups: PopupsState;
};

const BORDER_THICKNESS = 1;

export const useLayoutState = (
	width: number,
	showPreview: boolean,
	previewLayout: PreviewLayout,
) => {
	const [isPreview, setIsPreview] = useState(showPreview);
	const [isChooseOpenerPopupOpen, setIsChooseOpenerPopupOpen] = useState(false);

	const resultListContentWidth = useMemo(
		() =>
			(isPreview && previewLayout !== "bottom"
				? Math.floor(width / 2)
				: width) -
			2 * BORDER_THICKNESS,
		[isPreview, previewLayout, width],
	);

	const isPopupOpen = useMemo(
		() => isChooseOpenerPopupOpen,
		[isChooseOpenerPopupOpen],
	);

	const setLayoutState = (updater: (prev: LayoutState) => LayoutState) => {
		const prev: LayoutState = {
			isPreview,
			previewLayout,
			resultListContentWidth,
			popups: {
				isChooseOpenerPopupOpen,
				isPopupOpen,
			},
		};
		const next = updater(prev);
		setIsPreview(next.isPreview);
		setIsChooseOpenerPopupOpen(next.popups.isChooseOpenerPopupOpen);
	};

	return {
		layoutState: {
			isPreview,
			previewLayout,
			resultListContentWidth,
			popups: {
				isChooseOpenerPopupOpen,
				isPopupOpen,
			},
		},
		setLayoutState,
	};
};
