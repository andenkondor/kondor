import { type FC } from "react";
import type { SearchResult } from "@definitions/SearchResult";
import { ResultText } from "@components/ResultText";

type Props = {
  item: SearchResult;
  isSelected: boolean;
};

export const ResultFileLocation: FC<Props> = ({ item, isSelected }) => {
  return (
    <ResultText
      key={`result-file-location-${item.id}`}
      isSelected={isSelected}
      text={item.filePath}
    />
  );
};
