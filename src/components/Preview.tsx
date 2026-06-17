import { useConfig } from "@contexts/ConfigContext";
import { usePreview } from "@hooks/usePreview";
import type { BoxRenderable } from "@opentui/core";
import { ptyToJson, type TerminalData } from "ghostty-opentui";
import { type ReactNode, useMemo, useRef } from "react";

export const Preview = (): ReactNode => {
	const boxRef = useRef<BoxRenderable>(null);
	const { borderType } = useConfig();
	const previewContent = usePreview(boxRef.current?.height);

	const data: TerminalData = useMemo(
		() => ptyToJson(previewContent),
		[previewContent],
	);
	return (
		<box
			borderStyle={borderType}
			overflow="hidden"
			ref={boxRef}
			height={"100%"}
		>
			{data.lines.map((line, i) => (
				<text key={i} height={1} wrapMode="none">
					{line.spans.map(({ fg, bg, text }, j) => {
						return (
							<span key={j} fg={fg ?? undefined} bg={bg ?? undefined}>
								{text}
							</span>
						);
					})}
				</text>
			))}
		</box>
	);
};
