import { FzfFilterColumn } from "@components/fzf/FzfFilterColumn";
import { FzfFilterTerm } from "@components/fzf/FzfFilterTerm";
import { useFzf } from "@hooks/useFzf";
import type { ReactNode } from "react";

export const FzfControl = (): ReactNode => {
	useFzf();

	return (
		<box flexDirection="row" flexWrap="wrap">
			<box flexBasis={75} minWidth={10} flexGrow={0} flexShrink={1}>
				<FzfFilterTerm />
			</box>
			<box flexShrink={0}>
				<FzfFilterColumn />
			</box>
		</box>
	);
};
