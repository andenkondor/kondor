import { ResultLine } from "@components/ResultLine";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import type { ScrollBoxRenderable } from "@opentui/core";
import { type ReactNode, useEffect, useRef } from "react";

export const ResultListContent = (): ReactNode => {
	const {
		resultState: { overallResults },
		selectionState: { selectedResultIndex, markedResultIds },
	} = useApplicationState();

	const scrollRef = useRef<ScrollBoxRenderable | null>(null);

	useEffect(() => {
		if (!scrollRef.current) return;

		const currentScrollTop = scrollRef.current.scrollTop;

		if (currentScrollTop >= overallResults.length) {
			scrollRef.current.scrollTop = 0;
			return;
		}

		const scrollboxHeight = scrollRef.current.height;
		const bottomVisibleIndex = currentScrollTop + scrollboxHeight - 1;

		if (selectedResultIndex < currentScrollTop) {
			scrollRef.current.scrollTop = selectedResultIndex;
		} else if (selectedResultIndex > bottomVisibleIndex) {
			scrollRef.current.scrollTop = selectedResultIndex - scrollboxHeight + 1;
		}
	}, [selectedResultIndex, overallResults.length]);

	return (
		<scrollbox
			ref={scrollRef}
			viewportCulling
			scrollbarOptions={{ visible: false }}
		>
			{overallResults.map((item, index) => (
				<ResultLine
					key={item.id}
					item={item}
					isSelected={index === selectedResultIndex}
					isMarked={markedResultIds.has(item.id)}
				/>
			))}
		</scrollbox>
	);
};
