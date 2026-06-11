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

		const above = Math.max(0, Math.floor((previewHeight - 4) / 2));
		const fromLine = Math.max(1, previewedResult.lineNumber - above);

		setContent("");
		let isDisposed = false;

		const loadPreview = async () => {
			const nextContent = await Bat.show(previewedResult.filePath, {
				highlightedLine: previewedResult.lineNumber,
				fromLine,
				toLine: fromLine + 2 * above,
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
