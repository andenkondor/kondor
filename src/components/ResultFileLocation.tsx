import { type FC } from "react";
import type { SearchResult } from "@definitions/SearchResult";
import { ResultText } from "@components/ResultText";
import { useConfig } from "@contexts/ConfigContext";

type Props = {
  item: SearchResult;
  isSelected: boolean;
};

export const ResultFileLocation: FC<Props> = ({ item, isSelected }) => {
  const {
    colors: { filePathText: filePathTextColor },
  } = useConfig();
  return (
    <ResultText
      key={`result-file-location-${item.id}`}
      isSelected={isSelected}
      color={filePathTextColor}
      text={item.filePath}
    />
  );
};
