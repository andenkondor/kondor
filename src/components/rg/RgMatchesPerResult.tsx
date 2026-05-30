import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { type ReactNode, useRef } from "react";

export const RgMatchesPerResult = (): ReactNode => {
	const {
		colors: { highlightedBorder },
		layout: { borderType },
	} = useConfig();
	const {
		rgState: { rgOptions },
	} = useApplicationState();
	const initialRef = useRef(rgOptions.singleMatchPerResult);

	const infinity = "\u221E";
	const isInit = initialRef.current === rgOptions.singleMatchPerResult;

	const display = rgOptions.singleMatchPerResult ? "1" : infinity;
	return (
		<box
			title={"⌥4"}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
		>
			<text>{`matches/result: ${display}`}</text>
		</box>
	);
};
