import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { usePopup } from "@hooks/usePopup";
import { useRenderer } from "@opentui/react";
import { Opener } from "@tools/Opener";
import { type ReactNode, useCallback, useMemo } from "react";

export const ChooseOpener = (): ReactNode => {
	const renderer = useRenderer();
	const { openers } = useConfig();
	const {
		selectionState: { selectedResult },
	} = useApplicationState();
	const maxSelectableIndex = useMemo(
		() => Math.max(openers.length - 1, 0),
		[openers.length],
	);
	const executeOpener = useCallback(
		(index: number) => {
			if (!selectedResult || !openers[index]) {
				return;
			}
			Opener.execute(openers[index], selectedResult, renderer);
		},
		[openers, selectedResult, renderer],
	);
	const { selectedIndex } = usePopup(
		maxSelectableIndex,
		executeOpener,
		executeOpener,
	);
	const {
		colors: { focusedBorder, selectedBackground, defaultText },
	} = useConfig();

	if (!selectedResult) {
		return (
			<box padding={1}>
				<text fg={defaultText}>No result selected</text>
			</box>
		);
	}

	if (openers.length === 0) {
		return (
			<box padding={1}>
				<text fg={defaultText}>No openers configured</text>
			</box>
		);
	}

	return (
		<box flexDirection="column" padding={1} width="100%">
			{openers.map((opener, i) => (
				<box
					key={i}
					flexDirection="row"
					height={1}
					backgroundColor={i === selectedIndex ? focusedBorder : undefined}
				>
					<text
						width={2}
						fg={i === selectedIndex ? selectedBackground : defaultText}
					>
						{`${i + 1} `}
					</text>
					<text fg={i === selectedIndex ? selectedBackground : defaultText}>
						{opener.description}
					</text>
				</box>
			))}
		</box>
	);
};
