import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import type { ReactNode } from "react";

export const ErrorFooter = (): ReactNode => {
	const {
		resultState: { error },
	} = useApplicationState();
	const {
		colors: { errorBorder, defaultText },
		borderType,
	} = useConfig();

	if (!error) {
		return null;
	}

	return (
		<box flexShrink={0} borderStyle={borderType} borderColor={errorBorder}>
			<text paddingLeft={1} fg={defaultText}>
				{error}
			</text>
		</box>
	);
};
