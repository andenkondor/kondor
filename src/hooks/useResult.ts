import { useMemo } from "react";
import cliTruncate from "cli-truncate";
import { useConfig } from "@contexts/ConfigContext";
import type { SearchResult } from "@definitions/SearchResult";

export type TextSegment = {
  text: string;
  color?: string;
};

const ELLIPSIS = "\u2026";

export const useResult = (item: SearchResult, maxWidth: number) => {
  const {
    colors: { filePathText, highlightedText, fileLineNumber, truncationText },
  } = useConfig();

  const segments = useMemo(() => {
    const pathSegments: TextSegment[] = [
      { text: item.filePath, color: filePathText },
      { text: ":" },
      { text: item.lineNumber.toString(), color: fileLineNumber },
      { text: " " },
    ];

    const space =
      maxWidth - Bun.stringWidth(pathSegments.map((s) => s.text).join(""));
    if (space <= 0) {
      return pathSegments;
    }

    const { pre, match, post, parts } = extractContent(item);

    if (space <= match.length) {
      return [
        ...pathSegments,
        ...truncateMatch(match, space, highlightedText, truncationText),
      ];
    }

    if (pre.length + match.length + post.length <= space) {
      return [
        ...pathSegments,
        ...buildFullContent(pre, match, parts, highlightedText),
      ];
    }

    return [
      ...pathSegments,
      ...buildTruncatedContent(
        pre,
        match,
        post,
        parts,
        space,
        highlightedText,
        truncationText,
      ),
    ];
  }, [
    item.id,
    maxWidth,
    filePathText,
    highlightedText,
    fileLineNumber,
    truncationText,
  ]);

  return { segments };
};

const extractContent = (item: SearchResult) => {
  const firstMatch = item.subMatches[0];
  const pre = item.lineContent
    .slice(0, firstMatch?.start)
    .trimStart()
    .replaceAll("\t", "  ");
  const match = item.lineContent.slice(firstMatch?.start, firstMatch?.end);

  const parts: { text: string; highlighted: boolean }[] = [];
  let cursor = firstMatch?.end ?? 0;
  for (const m of item.subMatches.slice(1)) {
    parts.push({
      text: item.lineContent.slice(cursor, m.start),
      highlighted: false,
    });
    parts.push({
      text: item.lineContent.slice(m.start, m.end),
      highlighted: true,
    });
    cursor = m.end;
  }
  parts.push({
    text: item.lineContent.slice(cursor),
    highlighted: false,
  });

  const post = parts
    .map((p) => p.text)
    .join("")
    .trimEnd()
    .replaceAll("\t", "  ");

  return { pre, match, post, parts };
};

const truncateMatch = (
  match: string,
  space: number,
  highlightColor: string,
  truncationColor: string,
): TextSegment[] => {
  if (space <= 0) {
    return [];
  }

  if (space <= 1) {
    return [{ text: ELLIPSIS, color: truncationColor }];
  }

  return [
    { text: match.slice(0, space - 1), color: highlightColor },
    { text: ELLIPSIS, color: truncationColor },
  ];
};

const buildFullContent = (
  pre: string,
  match: string,
  parts: { text: string; highlighted: boolean }[],
  highlightColor: string,
): TextSegment[] => {
  const segments: TextSegment[] = [];
  if (pre) segments.push({ text: pre });
  segments.push({ text: match, color: highlightColor });
  for (const p of parts) {
    if (p.text) {
      segments.push({
        text: p.text.replaceAll("\t", "  "),
        color: p.highlighted ? highlightColor : undefined,
      });
    }
  }
  return segments;
};

const buildTruncatedContent = (
  pre: string,
  match: string,
  post: string,
  parts: { text: string; highlighted: boolean }[],
  space: number,
  highlightColor: string,
  truncationColor: string,
): TextSegment[] => {
  const { before, after } = distributeBudget(
    pre.length,
    post.length,
    space - match.length,
  );

  const segments: TextSegment[] = [];

  if (before > 0 && pre) {
    const tPre = cliTruncate(pre, before, {
      position: "middle",
      truncationCharacter: ELLIPSIS,
    });
    segments.push(...splitTruncatedText(tPre, truncationColor));
  }

  segments.push({ text: match, color: highlightColor });

  if (after > 0 && post) {
    const tPost = cliTruncate(post, after, {
      position: "end",
      truncationCharacter: ELLIPSIS,
    });

    segments.push(
      ...mapPostToParts(tPost, parts, highlightColor, truncationColor),
    );
  }

  return segments;
};

const mapPostToParts = (
  tPost: string,
  parts: { text: string; highlighted: boolean }[],
  highlightColor: string,
  truncationColor: string,
): TextSegment[] => {
  const hasEllipsis = tPost.endsWith(ELLIPSIS);
  const content = hasEllipsis ? tPost.slice(0, -1) : tPost;

  if (!content) {
    return hasEllipsis ? [{ text: ELLIPSIS, color: truncationColor }] : [];
  }

  const segments: TextSegment[] = [];
  let offset = 0;
  for (const p of parts) {
    if (offset >= content.length) break;
    const partText = p.text.replaceAll("\t", "  ");
    const len = Math.min(partText.length, content.length - offset);
    if (len > 0) {
      segments.push({
        text: partText.slice(0, len),
        color: p.highlighted ? highlightColor : undefined,
      });
      offset += len;
    }
  }

  if (hasEllipsis) {
    segments.push({ text: ELLIPSIS, color: truncationColor });
  }

  return segments;
};

const splitTruncatedText = (
  text: string,
  truncationColor: string,
): TextSegment[] => {
  const parts = text.split(ELLIPSIS);
  const segments: TextSegment[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part) {
      segments.push({ text: part });
    }
    if (i < parts.length - 1) {
      segments.push({ text: ELLIPSIS, color: truncationColor });
    }
  }
  return segments;
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
