import { useState, useEffect, type FC } from "react";
import { Text, useInput } from "ink";
import chalk from "chalk";

type Props = {
  readonly focus?: boolean;
  readonly value: string;
  readonly onChange: (value: string) => void;
};

export const TextInput: FC<Props> = ({ value, focus = true, onChange }) => {
  const [state, setState] = useState({
    cursorOffset: (value || "").length,
    cursorWidth: 0,
  });

  const { cursorOffset, cursorWidth } = state;

  useEffect(() => {
    setState((previousState) => {
      if (!focus) {
        return previousState;
      }

      const newValue = value || "";

      if (previousState.cursorOffset > newValue.length - 1) {
        return {
          cursorOffset: newValue.length,
          cursorWidth: 0,
        };
      }

      return previousState;
    });
  }, [value, focus]);

  let renderedValue = value;

  if (focus) {
    renderedValue = value.length > 0 ? "" : chalk.inverse(" ");

    let i = 0;

    for (const char of value) {
      renderedValue +=
        i >= cursorOffset - cursorWidth && i <= cursorOffset
          ? chalk.inverse(char)
          : char;

      i++;
    }

    if (value.length > 0 && cursorOffset === value.length) {
      renderedValue += chalk.inverse(" ");
    }
  }

  useInput(
    (input, key) => {
      if (
        key.upArrow ||
        key.downArrow ||
        key.ctrl ||
        key.tab ||
        key.return ||
        key.meta
      ) {
        return;
      }

      let nextCursorOffset = cursorOffset;
      let nextValue = value;
      let nextCursorWidth = 0;

      if (key.leftArrow) {
        if (key.meta) {
          // Alt+Left: move cursor to start of previous word
          let pos = cursorOffset;
          while (pos > 0 && value[pos - 1] === " ") {
            pos--;
          }
          while (pos > 0 && value[pos - 1] !== " ") {
            pos--;
          }
          nextCursorOffset = pos;
        } else {
          nextCursorOffset--;
        }
      } else if (key.rightArrow) {
        if (key.meta) {
          // Alt+Right: move cursor to start of next word
          let pos = cursorOffset;
          while (pos < value.length && value[pos] === " ") {
            pos++;
          }
          while (pos < value.length && value[pos] !== " ") {
            pos++;
          }
          nextCursorOffset = pos;
        } else {
          nextCursorOffset++;
        }
      } else if (key.meta && input === "b") {
        // Alt+B: move cursor backward one word (readline-style)
        let pos = cursorOffset;
        while (pos > 0 && value[pos - 1] === " ") {
          pos--;
        }
        while (pos > 0 && value[pos - 1] !== " ") {
          pos--;
        }
        nextCursorOffset = pos;
      } else if (key.meta && input === "f") {
        // Alt+F: move cursor forward one word (readline-style)
        let pos = cursorOffset;
        while (pos < value.length && value[pos] === " ") {
          pos++;
        }
        while (pos < value.length && value[pos] !== " ") {
          pos++;
        }
        nextCursorOffset = pos;
      } else if (key.backspace || key.delete) {
        if (key.meta && key.backspace && cursorOffset > 0) {
          // Option+Backspace: delete from cursor to start of word
          let deleteFrom = cursorOffset;

          // Skip whitespace immediately before cursor
          while (deleteFrom > 0 && value[deleteFrom - 1] === " ") {
            deleteFrom--;
          }

          // Skip the word characters
          while (deleteFrom > 0 && value[deleteFrom - 1] !== " ") {
            deleteFrom--;
          }

          nextValue =
            value.slice(0, deleteFrom) +
            value.slice(cursorOffset, value.length);

          nextCursorOffset = deleteFrom;
        } else if (cursorOffset > 0) {
          nextValue =
            value.slice(0, cursorOffset - 1) +
            value.slice(cursorOffset, value.length);

          nextCursorOffset--;
        }
      } else {
        nextValue =
          value.slice(0, cursorOffset) +
          input +
          value.slice(cursorOffset, value.length);

        nextCursorOffset += input.length;

        if (input.length > 1) {
          nextCursorWidth = input.length;
        }
      }

      if (cursorOffset < 0) {
        nextCursorOffset = 0;
      }

      if (cursorOffset > value.length) {
        nextCursorOffset = value.length;
      }

      setState({
        cursorOffset: nextCursorOffset,
        cursorWidth: nextCursorWidth,
      });

      if (nextValue !== value) {
        onChange(nextValue);
      }
    },
    { isActive: focus },
  );

  return <Text>{renderedValue}</Text>;
};
