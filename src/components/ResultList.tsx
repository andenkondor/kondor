import { useRef, type FC } from "react";
import { Box, useBoxMetrics } from "ink";
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
  const { height } = useBoxMetrics(boxRef);

  const isLoading = isFzfLoading || isRgLoading;
  const fzfResultIndicator = isLoading ? "?" : filterResults.length;
  const rgResultIndicator = isRgLoading ? "?" : searchResults.length;

  const selectedIndicator = filterResults.length
    ? `#${selectedResultIndex + 1} -- `
    : "";

  const statusIndicator = `${selectedIndicator}${fzfResultIndicator}/${rgResultIndicator}`;

  return (
    <TitledBox borderStyle={"single"} width={"100%"} titles={[statusIndicator]}>
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
