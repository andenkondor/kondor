import { useConfig } from "@contexts/ConfigContext";
import { Chalk } from "@tools/Chalk";
import { useCallback } from "react";

export const useChalk = () => {
  const {
    colors: {
      filePathText,
      highlightedText,
      normalText,
      selectedBackground,
      unselectedBackground,
      focusedBorder,
      unfocusedBorder,
      fileLineNumber,
      defaultText,
      truncationText,
    },
  } = useConfig();

  const colorFilePath = useCallback(
    (content: string) => {
      return Chalk.print(content,filePathText);
    },
    [filePathText],
  );

  const colorHighlightedText = useCallback(
    (content: string) => {
      return Chalk.print(content,highlightedText);
    },
    [highlightedText],
  );

  const colorNormalText = useCallback(
    (content: string) => {
      return Chalk.print(content,normalText);
    },
    [normalText],
  );

  const colorSelectedBackground = useCallback(
    (content: string) => {
      return Chalk.print(content,selectedBackground);
    },
    [selectedBackground],
  );

  const colorUnselectedBackground = useCallback(
    (content: string) => {
      return Chalk.print(content,unselectedBackground);
    },
    [unselectedBackground],
  );

  const colorFocusedBorder = useCallback(
    (content: string) => {
      return Chalk.print(content,focusedBorder);
    },
    [focusedBorder],
  );

  const colorUnfocusedBorder = useCallback(
    (content: string) => {
      return Chalk.print(content,unfocusedBorder);
    },
    [unfocusedBorder],
  );

  const colorFileLineNumber = useCallback(
    (content: string) => {
      return Chalk.print(content,fileLineNumber);
    },
    [fileLineNumber],
  );

  const colorDefaultText = useCallback(
    (content: string) => {
      return Chalk.print(content,defaultText);
    },
    [defaultText],
  );

  const colorTruncationText = useCallback(
    (content: string) => {
      return Chalk.print(content,truncationText);
    },
    [truncationText],
  );

  return {
    colorFilePath,
    colorHighlightedText,
    colorNormalText,
    colorSelectedBackground,
    colorUnselectedBackground,
    colorFocusedBorder,
    colorUnfocusedBorder,
    colorFileLineNumber,
    colorDefaultText,
    colorTruncationText,
  };
};
