import type { ReactNode } from "react";
import { useConfig } from "@contexts/ConfigContext";

type Props = {
  input: string;
  onInputChange: (input: string) => void;
  hasFocus: boolean;
  titles: string[];
};

export const BorderedTextInput = ({
  input,
  onInputChange,
  hasFocus,
  titles,
}: Props): ReactNode => {
  const {
    colors,
    layout: { borderType },
  } = useConfig();

  return (
    <box
      borderStyle={borderType}
      title={titles.join(" ")}
      width={100}
      borderColor={hasFocus ? colors.focusedBorder : colors.unfocusedBorder}
    >
      <input value={input} onInput={onInputChange} focused={hasFocus} />
    </box>
  );
};
