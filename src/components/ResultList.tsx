import { useRef, useState, type FC, type RefObject } from "react";
import { Box, useBoxMetrics, useInput, type DOMElement } from "ink";
import { ResultLine } from "@components/ResultLine";
import type { SearchResult } from "@definitions/SearchResult";
import { Nvim } from "@tools/Nvim";
import { Idea } from "@tools/Idea";
import { VirtualList } from "ink-virtual-list";

type Props = {
  resultItems: SearchResult[];
};

export const ResultList: FC<Props> = ({ resultItems }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const boxRef = useRef(null);
  const { height } = useBoxMetrics(boxRef as unknown as RefObject<DOMElement>);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(prev + 1, resultItems.length - 1));
    }
    if (key.return) {
      if (!resultItems.length) {
        return;
      }
      Nvim.open(resultItems[selectedIndex]!);
    }
    if (key.ctrl && input === "s") {
      if (!resultItems.length) {
        return;
      }
      Idea.open(resultItems[selectedIndex]!);
    }
  });

  return (
    <Box borderStyle={"single"} width={"100%"} ref={boxRef}>
      <VirtualList
        items={resultItems}
        selectedIndex={selectedIndex}
        showOverflowIndicators={false}
        // box size minus top/bottom border
        height={height - 2}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item, isSelected }) => (
          <ResultLine item={item} isSelected={isSelected} />
        )}
      />
    </Box>
  );
};
