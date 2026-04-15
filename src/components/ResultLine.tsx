import { type FC } from "react";
import { Text, Box } from "ink";
import type { SearchResult } from "@definitions/SearchResult";
import { useConfig, type Config } from "@contexts/ConfigContext";

type Props = {
  item: SearchResult;
  isSelected: boolean;
};

export const ResultLine: FC<Props> = ({ item, isSelected }) => {
  const config = useConfig();
  const { colors } = config;
  return (
    <Box key={item.id}>
      {getText(
        (isSelected ? "> " : "  ") + item.filePath + ":",
        isSelected,
        false,
        colors,
      )}
      {getHighlightedLine(item, isSelected, colors)}
    </Box>
  );
};

const getHighlightedLine = (rgMatch: SearchResult, isSelected: boolean, colors: Config["colors"]) => {
  // 1. Create a sorted list of all index boundaries
  const boundaries = new Set([0, rgMatch.lineContent.length]);
  for (const h of rgMatch.subMatches) {
    boundaries.add(h.start);
    boundaries.add(h.end);
  }
  const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

  // 2. Map boundaries into chunks and check for highlights
  const elements = [];

  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const start = sortedBoundaries[i]!;
    const end = sortedBoundaries[i + 1]!;
    const chunk = rgMatch.lineContent.slice(start, end);

    // Find if this specific chunk falls inside any highlight range
    const highlight = rgMatch.subMatches.find(
      (h) => start >= h.start && end <= h.end,
    );

    elements.push(getText(chunk, isSelected, Boolean(highlight), colors));
  }

  return <Text>{elements}</Text>;
};

const getText = (
  content: string,
  isSelected: boolean,
  isHighlighted: boolean,
  colors: Config["colors"],
) => (
  <Text
    color={Boolean(isHighlighted) ? colors.highlightedText : colors.normalText}
    backgroundColor={isSelected ? colors.selectedBackground : colors.unselectedBackground}
  >
    {content}
  </Text>
);
