import { type FC } from "react";
import { Box } from "ink";
import type { SearchResult } from "@definitions/SearchResult";
import { ResultFileLocation } from "@components/ResultFileLocation";
import { ResultLineContent } from "@components/ResultLineContent";
import { ResultText } from "@components/ResultText";

type Props = {
  item: SearchResult;
  isSelected: boolean;
};

export const ResultLine: FC<Props> = ({ item, isSelected }) => {
  return (
    <Box key={`result-line-${item.id}`}>
      <ResultText
        key={`result-line-indicator-${item.id}`}
        text={isSelected ? "> " : "  "}
        isSelected={isSelected}
      />
      <ResultFileLocation item={item} isSelected={isSelected} />
      <ResultText text={" "} isSelected={isSelected} />
      <ResultLineContent item={item} isSelected={isSelected} />
    </Box>
  );
};
