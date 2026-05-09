import { type FC } from "react";
import type { SearchResult } from "@definitions/SearchResult";
import { ResultText } from "@components/ResultText";
import { useConfig } from "@contexts/ConfigContext";
import { Box } from "ink";

type Props = {
  item: SearchResult;
  isSelected: boolean;
};

export const ResultFileLocation: FC<Props> = ({ item, isSelected }) => {
  const {
    colors: {
      filePathText: filePathTextColor,
      fileLineNumber: fileLineNumberColor,
      defaultText: defaultTextColor,
    },
  } = useConfig();
  return (
    <Box key={`result-file-location-path-${item.id}`}>
      <ResultText
        isSelected={isSelected}
        color={filePathTextColor}
        text={item.filePath}
      />
      <ResultText isSelected={isSelected} color={defaultTextColor} text={":"} />
      <ResultText
        isSelected={isSelected}
        color={fileLineNumberColor}
        text={item.lineNumber.toString()}
      />
    </Box>
  );
};
