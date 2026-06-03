import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import type { ReactNode } from "react";

export const RgUnrestricted = (): ReactNode => {
	const {
		colors: { highlightedBorder },
		layout: { borderType },
	} = useConfig();
	const {
		rgState: { rgOptions },
		cycleRgUnrestricted,
	} = useApplicationState();

	const display = String(rgOptions.unrestricted);
	return (
		<box
			title={"⌥5"}
			borderStyle={borderType}
			borderColor={rgOptions.unrestricted > 0 ? highlightedBorder : undefined}
			onMouseDown={cycleRgUnrestricted}
		>
			<text>{`unrestricted: ${display}`}</text>
		</box>
	);
};
