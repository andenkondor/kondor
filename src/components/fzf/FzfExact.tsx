import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { Platform } from "@tools/platform";
import { type ReactNode, useRef } from "react";

export const FzfExact = (): ReactNode => {
	const {
		colors: { highlightedBorder },
		layout: { borderType },
	} = useConfig();
	const {
		fzfState: { fzfOptions },
		cycleFzfIsExact,
	} = useApplicationState();
	const initialRef = useRef(fzfOptions.isExact);

	const isInit = initialRef.current === fzfOptions.isExact;
	const display = fzfOptions.isExact ? "exact" : "fuzzy";
	return (
		<box
			title={`${Platform.getOptKey()}+7`}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
			onMouseDown={cycleFzfIsExact}
		>
			<text>{display}</text>
		</box>
	);
};
