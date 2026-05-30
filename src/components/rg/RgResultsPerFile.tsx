import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { type ReactNode, useRef } from "react";

export const RgResultsPerFile = (): ReactNode => {
	const {
		colors: { highlightedBorder },
		layout: { borderType },
	} = useConfig();
	const {
		rgState: { rgOptions },
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
			title={"⌥3"}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
		>
			<text>{`results/file: ${resultsPerFile}`}</text>
		</box>
	);
};
