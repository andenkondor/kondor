import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { Platform } from "@tools/platform";
import { type ReactNode, useRef } from "react";

export const RgWordRegxp = (): ReactNode => {
	const {
		colors: { highlightedBorder },
		layout: { borderType },
	} = useConfig();
	const {
		rgState: { rgOptions },
		cycleRgWordRegexp,
	} = useApplicationState();
	const initialRef = useRef(rgOptions.wordRegexp);

	const isInit = initialRef.current === rgOptions.wordRegexp;

	const display = rgOptions.wordRegexp ? "match whole word" : "match any";
	return (
		<box
			title={`${Platform.getOptKey()}+2`}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
			onMouseDown={cycleRgWordRegexp}
		>
			<text>{display}</text>
		</box>
	);
};
