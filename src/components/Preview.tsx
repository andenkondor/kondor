import { useMemo, useRef, type ReactNode } from "react";
import { ptyToJson, type TerminalData } from "ghostty-opentui";
import { usePreview } from "@hooks/usePreview";
import { useConfig } from "@contexts/ConfigContext";
import type { BoxRenderable } from "@opentui/core";

export const Preview = (): ReactNode => {
  const boxRef = useRef<BoxRenderable>(null);
  const {
    layout: { borderType },
  } = useConfig();
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
