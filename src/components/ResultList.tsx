import { useRef, type FC, type RefObject } from "react";
import { Box, useBoxMetrics, type DOMElement } from "ink";
import { ResultLine } from "@components/ResultLine";
import { VirtualList } from "ink-virtual-list";
import { TitledBox } from "@mishieck/ink-titled-box";
import { useApplicationState } from "@contexts/ApplicationStateContext";

export const ResultList: FC = () => {
  const {
    rgState: { searchResults, isLoading: isRgLoading },
    fzfState: { filterResults, isLoading: isFzfLoading },
    selectionState: { selectedResultIndex },
  } = useApplicationState();
  const boxRef = useRef(null);
  const { height } = useBoxMetrics(boxRef as unknown as RefObject<DOMElement>);

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
            selectedIndex={selectedResultIndex}
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
