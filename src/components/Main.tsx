import { Preview } from "@components/Preview";
import { ResultList } from "@components/ResultList";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useTerminalDimensions } from "@opentui/react";
import type { ReactNode } from "react";

export const Main = (): ReactNode => {
	const {
		layoutState: { isPreview, previewLayout },
	} = useApplicationState();
	const { width, height } = useTerminalDimensions();

	return (
		<box flexGrow={1}>
			{previewLayout === "bottom" ? (
				<box flexDirection="column">
					<box flexBasis={height}>
						<ResultList />
					</box>
					{isPreview && (
						<box flexBasis={height}>
							<Preview />
						</box>
					)}
				</box>
			) : (
				<box flexDirection="row">
					<box flexBasis={width}>
						<ResultList />
					</box>
					{isPreview && (
						<box flexBasis={width}>
							<Preview />
						</box>
					)}
				</box>
			)}
		</box>
	);
};
