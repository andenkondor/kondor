import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { type ReactNode, useRef } from "react";

export const RgCase = (): ReactNode => {
	const {
		colors: { highlightedBorder },
		layout: { borderType },
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
			title={"⌥1"}
			borderStyle={borderType}
			borderColor={isInit ? undefined : highlightedBorder}
			onMouseDown={cycleRgCase}
		>
			<text>{display}</text>
		</box>
	);
};
