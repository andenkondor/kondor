import { useRef, useState, type FC } from "react";
import { Box, useInput } from "ink";
import { ScrollList, type ScrollListRef } from "ink-scroll-list";
import { ResultLine } from "@components/ResultLine";
import type { SearchResult } from "@definitions/SearchResult";
import { Nvim } from "@tools/Nvim";
import { Idea } from "@tools/Idea";

type Props = {
  resultItems: SearchResult[];
};

export const ResultList: FC<Props> = ({ resultItems }) => {
  const listRef = useRef<ScrollListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Handle keyboard navigation in the parent
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
    <Box borderStyle={"single"}>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {resultItems.map((item, i) => (
          <ResultLine item={item} isSelected={i === selectedIndex} />
        ))}
      </ScrollList>
    </Box>
  );
};
