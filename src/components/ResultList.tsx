import { useRef, useState, type FC, type RefObject } from "react";
import { Box, useBoxMetrics, useInput, type DOMElement } from "ink";
import { ResultLine } from "@components/ResultLine";
import { Nvim } from "@tools/Nvim";
import { Idea } from "@tools/Idea";
import { VirtualList } from "ink-virtual-list";
import { TitledBox } from "@mishieck/ink-titled-box";
import { useApplicationState } from "@contexts/ApplicationStateContext";

export const ResultList: FC = () => {
  const {
    rgState: { searchResults, isLoading: isRgLoading },
    fzfState: { filterResults, isLoading: isFzfLoading },
  } = useApplicationState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const boxRef = useRef(null);
  const { height } = useBoxMetrics(boxRef as unknown as RefObject<DOMElement>);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(prev + 1, filterResults.length - 1));
    }
    if (key.return) {
      if (!filterResults.length) {
        return;
      }
      Nvim.open(filterResults[selectedIndex]!);
    }
    if (key.ctrl && input === "s") {
      if (!filterResults.length) {
        return;
      }
      Idea.open(filterResults[selectedIndex]!);
    }
  });

  const isLoading = isFzfLoading || isRgLoading;
  const fzfResultIndicator = isLoading ? "?" : filterResults.length;
  const rgResultIndicator = isRgLoading ? "?" : searchResults.length;

  return (
    <TitledBox
      borderStyle={"single"}
      width={"100%"}
      titles={[`${fzfResultIndicator}/${rgResultIndicator}`]}
    >
      {isLoading ? null : (
        <Box ref={boxRef}>
          <VirtualList
            items={filterResults}
            selectedIndex={selectedIndex}
            showOverflowIndicators={false}
            height={height}
            keyExtractor={({ id }) => id.toString()}
            renderItem={({ item, isSelected }) => (
              <ResultLine item={item} isSelected={isSelected} />
            )}
          />
        </Box>
      )}
    </TitledBox>
  );
};
