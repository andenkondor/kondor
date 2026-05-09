import { useState, type FC } from "react";
import { Box, useInput } from "ink";
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
    <Box borderStyle={"single"} width={"100%"}>
      <VirtualList
        items={resultItems}
        selectedIndex={selectedIndex}
        showOverflowIndicators={false}
        height={"auto"}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, isSelected }) => (
          <ResultLine item={item} isSelected={isSelected} />
        )}
      />
    </Box>
  );
};
