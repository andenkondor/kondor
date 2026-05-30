import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Bat } from "@tools/Bat";
import { useEffect, useState } from "react";

export const usePreview = (previewHeight: number = 0) => {
	const {
		layoutState: { isPreview },
		selectionState: { previewedResult, selectedResult },
	} = useApplicationState();

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

		const above = Math.floor((previewHeight - 1) / 2);
		const fromLine = Math.max(1, previewedResult.lineNumber - above);

		setContent("");
		let isDisposed = false;

		const loadPreview = async () => {
			const nextContent = await Bat.show(previewedResult.filePath, {
				highlightedLine: previewedResult.lineNumber,
				fromLine,
				toLine: fromLine + 2 * above,
			});

			if (!isDisposed) {
				setContent(nextContent);
			}
		};

		loadPreview();

		return () => {
			isDisposed = true;
		};
	}, [previewedResult, isPreview, previewHeight, selectedResult]);

	return content;
};
