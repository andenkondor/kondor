import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { Platform } from "@tools/platform";
import { type ReactNode, useRef } from "react";

export const FzfFilterColumn = (): ReactNode => {
	const {
		colors: { highlightedBorder },
		layout: { borderType },
	} = useConfig();
	const {
		fzfState: { fzfOptions },
		cycleFzfFilterColumn,
	} = useApplicationState();
	const initialRef = useRef(fzfOptions.filterColumn);

	const isInit = initialRef.current === fzfOptions.filterColumn;

	const display =
		fzfOptions.filterColumn === "all"
			? "filter all columns"
			: fzfOptions.filterColumn === "filePath"
				? "filter file path"
				: "filter line content";
	return (
		<box
			title={`${Platform.getOptKey()}+6`}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
			onMouseDown={cycleFzfFilterColumn}
		>
			<text>{display}</text>
		</box>
	);
};
