import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Bat } from "@tools/Bat";
import { useEffect, useState } from "react";

export const usePreview = (previewHeight: number = 0) => {
	const {
		layoutState: { isPreview, previewLayout },
		selectionState: { previewedResult, selectedResult },
	} = useApplicationState();

	const batStyle =
		previewLayout === "bottom" ? "changes,numbers,snip" : undefined;

	const [content, setContent] = useState("");

	useEffect(() => {
		if (!isPreview || !previewedResult) {
			setContent("");
			return;
		}

		if (previewedResult.id !== selectedResult?.id) {
			setContent("");
			return;
		}

		const contentLines = Math.max(1, previewHeight - 2);
		const above = Math.max(0, Math.floor((contentLines - 1) / 2));
		const fromLine = Math.max(1, previewedResult.lineNumber - above);
		const toLine = fromLine + contentLines - 1;

		setContent("");
		let isDisposed = false;

		const loadPreview = async () => {
			const nextContent = await Bat.show(previewedResult.filePath, {
				highlightedLine: previewedResult.lineNumber,
				fromLine,
				toLine,
				style: batStyle,
			});

			if (!isDisposed) {
				setContent(nextContent);
			}
		};

		loadPreview();

		return () => {
			isDisposed = true;
		};
	}, [previewedResult, isPreview, previewHeight, batStyle, selectedResult]);

	return content;
};
