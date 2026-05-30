import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import type { SearchResult } from "@definitions/SearchResult";
import { useResult } from "@hooks/useResult";
import { type ReactNode, useMemo } from "react";

type Props = {
	item: SearchResult;
	isSelected: boolean;
	isMarked: boolean;
};

export const ResultLine = ({
	item,
	isSelected,
	isMarked,
}: Props): ReactNode => {
	const {
		colors: { selectedBackground },
		markSymbol,
		selectionSymbol,
	} = useConfig();

	const indicator = useMemo(
		() =>
			isSelected
				? isMarked
					? `${selectionSymbol}${markSymbol}`
					: `${selectionSymbol} `
				: isMarked
					? ` ${markSymbol}`
					: "  ",
		[selectionSymbol, markSymbol, isSelected, isMarked],
	);

	const {
		layoutState: { resultListContentWidth },
	} = useApplicationState();

	const { segments } = useResult(
		item,
		resultListContentWidth - Bun.stringWidth(indicator),
	);

	return (
		<box
			flexDirection="row"
			height={1}
			backgroundColor={isSelected ? selectedBackground : undefined}
		>
			<text flexShrink={0}>{indicator}</text>
			<text>
				{segments.map((segment, index) => (
					<span key={index} fg={segment.color}>
						{segment.text}
					</span>
				))}
			</text>
		</box>
	);
};
