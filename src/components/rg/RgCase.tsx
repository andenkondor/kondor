import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { Platform } from "@tools/platform";
import { type ReactNode, useRef } from "react";

export const RgCase = (): ReactNode => {
	const {
		colors: { highlightedBorder, defaultText },
		borderType,
	} = useConfig();
	const {
		rgState: { rgOptions },
		cycleRgCase,
	} = useApplicationState();
	const initialRef = useRef(rgOptions.case);

	const isInit = initialRef.current === rgOptions.case;
	const display =
		rgOptions.case === "--smart-case" ? "smart case" : "case sensitive";
	return (
		<box
			title={`${Platform.getOptKey()}+1`}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
			onMouseDown={cycleRgCase}
		>
			<text fg={defaultText}>{display}</text>
		</box>
	);
};
