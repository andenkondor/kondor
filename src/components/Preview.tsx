import { useRef, type FC, type RefObject } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Bat } from "@tools/Bat";
import { Box, Text, useBoxMetrics, type DOMElement } from "ink";

export const Preview: FC = () => {
  const boxRef = useRef(null);
  const { height } = useBoxMetrics(boxRef as unknown as RefObject<DOMElement>);
  const {
    selectionState: { selectedResult },
    layoutState: { isPreview },
  } = useApplicationState();

  if (!isPreview) {
    return null;
  }

  let content = "";

  if (selectedResult) {
    const availableLines = height - 2;
    const above = Math.floor((availableLines - 1) / 2);
    const fromLine = Math.max(1, selectedResult.lineNumber - above);

    content = Bat.show(selectedResult.filePath, {
      highlightedLine: selectedResult.lineNumber,
      fromLine,
    });
  }

  return (
    <Box borderStyle={"single"} width={"100%"} ref={boxRef} overflow="hidden">
      <Text>{content}</Text>
    </Box>
  );
};
