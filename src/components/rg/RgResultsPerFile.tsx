import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { Platform } from "@tools/platform";
import { type ReactNode, useRef } from "react";

export const RgResultsPerFile = (): ReactNode => {
	const {
		colors: { highlightedBorder },
		layout: { borderType },
	} = useConfig();
	const {
		rgState: { rgOptions },
		cycleRgResultsPerFile,
	} = useApplicationState();
	const initialRef = useRef(rgOptions.resultsPerFile);

	const infinity = "\u221E";
	const isInit = initialRef.current === rgOptions.resultsPerFile;

	const resultsPerFile =
		rgOptions.resultsPerFile != null
			? String(rgOptions.resultsPerFile)
			: infinity;
	return (
		<box
			title={`${Platform.getOptKey()}+3`}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
			onMouseDown={cycleRgResultsPerFile}
		>
			<text>{`results/file: ${resultsPerFile}`}</text>
		</box>
	);
};
