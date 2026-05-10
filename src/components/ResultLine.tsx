import { type FC } from "react";
import { Box } from "ink";
import type { SearchResult } from "@definitions/SearchResult";
import { useConfig } from "@contexts/ConfigContext";
import { ResultText } from "@components/ResultText";
import { useChalk } from "@hooks/useChalk";

type Props = {
  item: SearchResult;
  isSelected: boolean;
};

export const ResultLine: FC<Props> = ({ item, isSelected }) => {
  const {
    colors: { selectedBackground, unselectedBackground },
  } = useConfig();
  const {
    colorFilePath,
    colorHighlightedText,
    colorFileLineNumber,
    colorDefaultText,
  } = useChalk();

  const firstMatch = item.subMatches[0];
  const preMatchContent = item.lineContent.slice(0, firstMatch?.start);
  const matchContent = item.lineContent.slice(
    firstMatch?.start,
    firstMatch?.end,
  );

  const postMatchContent: string[] = [];
  let cursor = firstMatch?.end ?? 0;

  for (const match of item.subMatches.slice(1)) {
    postMatchContent.push(item.lineContent.slice(cursor, match.start));
    postMatchContent.push(
      colorHighlightedText(item.lineContent.slice(match.start, match.end)),
    );

    cursor = match.end;
  }
  postMatchContent.push(item.lineContent.slice(cursor));

  const backgroundColor = isSelected
    ? selectedBackground
    : unselectedBackground;

  const selectionIndicator = isSelected ? "> " : "  ";

  return (
    <Box key={`result-line-${item.id}`} backgroundColor={backgroundColor}>
      {/* > */}
      <Box flexShrink={0}>
        <ResultText text={selectionIndicator} />
      </Box>
      {/* file/path/file.txt */}
      <Box flexShrink={0}>
        <ResultText text={colorFilePath(item.filePath)} wrap="truncate-middle" />
      </Box>
      {/* :16  */}
      <Box flexShrink={0}>
        <ResultText
          text={
            colorDefaultText(":") +
            colorFileLineNumber(item.lineNumber.toString()) +
            " "
          }
        />
      </Box>
      {/* Prematch */}
      <Box flexShrink={2}>
        <ResultText text={preMatchContent} wrap="truncate-middle" />
      </Box>
      <Box flexShrink={0}>
        {/* Match */}
        <ResultText text={colorHighlightedText(matchContent)} />
      </Box>
      <Box flexShrink={3}>
        {/* Postmatch */}
        <ResultText text={postMatchContent.join("")} wrap="truncate-end" />
      </Box>
    </Box>
  );
};
