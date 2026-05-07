import { type FC } from "react";
import { Box } from "ink";
import type { SearchResult } from "@definitions/SearchResult";
import { ResultText } from "@components/ResultText";

type Props = {
  item: SearchResult;
  isSelected: boolean;
};

export const ResultLineContent: FC<Props> = ({ item, isSelected }) => {
  const boundaries = new Set([0, item.lineContent.length]);
  for (const h of item.subMatches) {
    boundaries.add(h.start);
    boundaries.add(h.end);
  }
  const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b);

  const elements = [];

  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const start = sortedBoundaries[i]!;
    const end = sortedBoundaries[i + 1]!;
    const chunk = item.lineContent.slice(start, end);

    const highlight = item.subMatches.find(
      (h) => start >= h.start && end <= h.end,
    );

    elements.push(
      <ResultText
        key={`result-line-content-chunk-${elements.length}`}
        isHighlighted={Boolean(highlight)}
        isSelected={isSelected}
        text={chunk}
      />,
    );
  }

  return <Box key={`result-line-content-box-${item.id}`}>{elements}</Box>;
};
