import { useMemo, type FC } from "react";
import { Box, Text } from "ink";
import type { SearchResult } from "@definitions/SearchResult";
import { useConfig } from "@contexts/ConfigContext";
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

  const {
    preMatchContent,
    matchContent,
    postMatchContent,
    backgroundColor,
    selectionIndicator,
  } = useMemo(() => {
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

    return {
      preMatchContent: sanitize(preMatchContent.trimStart()),
      matchContent,
      postMatchContent: sanitize(postMatchContent.join("").trimEnd()),
      backgroundColor,
      selectionIndicator,
    };
  }, [item.id, isSelected]);

  return (
    <Box key={`result-line-${item.id}`} backgroundColor={backgroundColor}>
      {/* > */}
      <Box flexShrink={0}>
        <Text>{selectionIndicator}</Text>
      </Box>
      {/* file/path/file.txt */}
      <Box flexShrink={0}>
        <Text wrap="truncate-middle">{colorFilePath(item.filePath)}</Text>
      </Box>
      {/* :16  */}
      <Box flexShrink={0}>
        <Text>
          {colorDefaultText(":") +
            colorFileLineNumber(item.lineNumber.toString()) +
            " "}
        </Text>
      </Box>
      {/* Prematch */}
      <Box flexShrink={2}>
        <Text wrap="truncate-middle">{preMatchContent}</Text>
      </Box>
      <Box flexShrink={0}>
        {/* Match */}
        <Text>{colorHighlightedText(matchContent)}</Text>
      </Box>
      <Box flexShrink={3}>
        {/* Postmatch */}
        <Text wrap="truncate-end">{postMatchContent}</Text>
      </Box>
    </Box>
  );
};

const sanitize = (content: string) => content.replaceAll("\t", "  ");
