import { useMemo } from "react";
import cliTruncate from "cli-truncate";
import { useChalk } from "@hooks/useChalk";
import type { SearchResult } from "@definitions/SearchResult";

export const useResult = (item: SearchResult, maxWidth: number) => {
  const {
    colorFilePath,
    colorHighlightedText,
    colorFileLineNumber,
    colorDefaultText,
    colorTruncationText,
  } = useChalk();

  const truncationChar = colorTruncationText("…");

  const { pathColumn, contentColumn } = useMemo(() => {
    const firstMatch = item.subMatches[0];
    const preMatchContent = sanitize(
      item.lineContent.slice(0, firstMatch?.start).trimStart(),
    );

    const matchContent = item.lineContent.slice(
      firstMatch?.start,
      firstMatch?.end,
    );

    const postMatch: string[] = [];
    let cursor = firstMatch?.end ?? 0;

    for (const match of item.subMatches.slice(1)) {
      postMatch.push(item.lineContent.slice(cursor, match.start));
      postMatch.push(
        colorHighlightedText(item.lineContent.slice(match.start, match.end)),
      );

      cursor = match.end;
    }
    postMatch.push(item.lineContent.slice(cursor));

    const pathColumn =
      colorFilePath(item.filePath) +
      colorDefaultText(":") +
      colorFileLineNumber(item.lineNumber.toString()) +
      " ";

    const postMatchContent = sanitize(postMatch.join("").trimEnd());

    const remainingSpace = maxWidth - Bun.stringWidth(pathColumn);

    const contentColumn = buildContentColumn(
      preMatchContent,
      matchContent,
      postMatchContent,
      remainingSpace,
      colorHighlightedText,
      truncationChar,
    );

    return {
      pathColumn,
      contentColumn,
    };
  }, [item.id, maxWidth, truncationChar]);

  return { pathColumn, contentColumn };
};

const buildContentColumn = (
  pre: string,
  match: string,
  post: string,
  available: number,
  highlight: (text: string) => string,
  truncationChar: string,
) => {
  const matchLen = match.length;
  if (available <= matchLen) {
    return highlight(match);
  }

  const preLen = pre.length;
  const postLen = post.length;
  const contextSpace = available - matchLen;

  if (preLen + matchLen + postLen <= available) {
    return pre + highlight(match) + post;
  }

  const { before, after } = distributeBudget(preLen, postLen, contextSpace);

  return (
    cliTruncate(pre, before, {
      position: "middle",
      preferTruncationOnSpace: true,
      truncationCharacter: truncationChar,
    }) +
    highlight(match) +
    cliTruncate(post, after, {
      position: "end",
      preferTruncationOnSpace: true,
      truncationCharacter: truncationChar,
    })
  );
};

const distributeBudget = (
  preLen: number,
  postLen: number,
  available: number,
) => {
  let before = Math.min(preLen, Math.ceil(available / 2));
  let after = Math.min(postLen, Math.floor(available / 2));
  let remaining = available - before - after;

  if (remaining > 0) {
    const toPre = Math.min(remaining, preLen - before);
    before += toPre;
    remaining -= toPre;
  }
  if (remaining > 0) {
    after += Math.min(remaining, postLen - after);
  }

  return { before, after };
};

const sanitize = (content: string) => content.replaceAll("\t", "  ");
