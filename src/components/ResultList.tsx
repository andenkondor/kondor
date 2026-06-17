import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { useResultStatus } from "@hooks/useResultStatus";
import { useSpinner } from "@hooks/useSpinner";
import type { ReactNode } from "react";
import { ResultListContent } from "./ResultListContent";

export const ResultList = (): ReactNode => {
	const {
		colors: { defaultText },
		borderType,
	} = useConfig();
	const {
		resultState: { isLoading },
	} = useApplicationState();

	const spinner = useSpinner(isLoading);
	const { statusIndicator } = useResultStatus();

	return (
		<box borderStyle={borderType} title={statusIndicator} width="100%">
			{isLoading ? (
				<box
					flexDirection="row"
					justifyContent="center"
					alignItems="center"
					width="100%"
					height="100%"
				>
					<text fg={defaultText}>{spinner}</text>
				</box>
			) : (
				<ResultListContent />
			)}
		</box>
	);
};
