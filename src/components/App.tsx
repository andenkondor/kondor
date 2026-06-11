import { ErrorFooter } from "@components/ErrorFooter";
import { FzfControl } from "@components/fzf/FzfControl";
import { Main } from "@components/Main";
import { Popup } from "@components/Popup";
import { RgControl } from "@components/rg/RgControl";
import { useInput } from "@hooks/useInput";
import type { ReactNode } from "react";

export const App = (): ReactNode => {
	useInput();

	return (
		<box flexDirection="column">
			<box flexShrink={0}>
				<RgControl />
			</box>
			<box flexShrink={0}>
				<FzfControl />
			</box>
			<Main />
			<ErrorFooter />
			<Popup />
		</box>
	);
};
