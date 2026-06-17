import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { Platform } from "@tools/platform";
import { type ReactNode, useRef } from "react";

export const RgMatchesPerResult = (): ReactNode => {
	const {
		colors: { highlightedBorder, defaultText },
		borderType,
	} = useConfig();
	const {
		rgState: { rgOptions },
		cycleRgSingleMatchPerResult,
	} = useApplicationState();
	const initialRef = useRef(rgOptions.singleMatchPerResult);

	const infinity = "\u221E";
	const isInit = initialRef.current === rgOptions.singleMatchPerResult;

	const display = rgOptions.singleMatchPerResult ? "1" : infinity;
	return (
		<box
			title={`${Platform.getOptKey()}+4`}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
			onMouseDown={cycleRgSingleMatchPerResult}
		>
			<text fg={defaultText}>{`matches/result: ${display}`}</text>
		</box>
	);
};
