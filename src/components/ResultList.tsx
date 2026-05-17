import { useRef, type FC } from "react";
import { Box, useBoxMetrics } from "ink";
import { ResultLine } from "@components/ResultLine";
import { VirtualList } from "ink-virtual-list";
import { TitledBox } from "@mishieck/ink-titled-box";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";

export const ResultList: FC = () => {
  const {
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { searchResults, isLoading: isRgLoading },
    fzfState: { filterResults, isLoading: isFzfLoading },
    selectionState: { selectedResultIndex },
  } = useApplicationState();
  const boxRef = useRef(null);
  const { height, width } = useBoxMetrics(boxRef);

  const isLoading = isFzfLoading || isRgLoading;
  const fzfResultIndicator = isLoading ? "?" : filterResults.length;
  const rgResultIndicator = isRgLoading ? "?" : searchResults.length;

  const selectedIndicator = filterResults.length
    ? `#${selectedResultIndex + 1} -- `
    : "";

  const statusIndicator = `${selectedIndicator}${fzfResultIndicator}/${rgResultIndicator}`;

  return (
    <TitledBox borderStyle={borderType} titles={[statusIndicator]}>
      {isLoading ? null : (
        <Box ref={boxRef} width={"100%"}>
          <VirtualList
            items={filterResults}
            selectedIndex={selectedResultIndex}
            showOverflowIndicators={false}
            height={height}
            keyExtractor={({ id }) => id.toString()}
            renderItem={({ item, isSelected }) => (
              <ResultLine
                item={item}
                isSelected={isSelected}
                maxWidth={width}
              />
            )}
          />
        </Box>
      )}
    </TitledBox>
  );
};
