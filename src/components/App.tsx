import { FzfControl } from "@components/fzf/FzfControl";
import { Popup } from "@components/Popup";
import { Preview } from "@components/Preview";
import { ResultList } from "@components/ResultList";
import { RgControl } from "@components/rg/RgControl";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useInput } from "@hooks/useInput";
import { useTerminalDimensions } from "@opentui/react";
import type { ReactNode } from "react";

export const App = (): ReactNode => {
	useInput();
	const {
		layoutState: { isPreview },
	} = useApplicationState();
	const { width } = useTerminalDimensions();

	return (
		<box flexDirection="column">
			<box flexShrink={0}>
				<RgControl />
			</box>
			<box flexShrink={0}>
				<FzfControl />
			</box>
			<box flexGrow={1}>
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
			</box>
			<Popup />
		</box>
	);
};
