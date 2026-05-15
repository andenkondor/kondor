import { memo, type FC } from "react";
import { Box, Text } from "ink";
import type { SearchResult } from "@definitions/SearchResult";
import { useConfig } from "@contexts/ConfigContext";
import { useResult } from "@hooks/useResult";

type Props = {
  item: SearchResult;
  isSelected: boolean;
  maxWidth: number;
};

export const ResultLine: FC<Props> = ({ item, isSelected, maxWidth }) => {
  const {
    colors: { selectedBackground, unselectedBackground },
  } = useConfig();

  const backgroundColor = isSelected
    ? selectedBackground
    : unselectedBackground;

  const selectionIndicator = isSelected ? "> " : "  ";

  const { pathColumn, contentColumn } = useResult(
    item,
    maxWidth -
      selectionIndicator.length -
      // don't count borders
      2,
  );
  return (
    <Box backgroundColor={backgroundColor}>
      <CachedResultLineContent
        content={selectionIndicator + pathColumn + contentColumn}
      />
    </Box>
  );
};

const ResultLineContent: FC<{ content: string }> = ({ content }) => {
  return <Text>{content}</Text>;
};

const CachedResultLineContent = memo(ResultLineContent);
