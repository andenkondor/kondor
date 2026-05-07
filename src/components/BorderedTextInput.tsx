import { TitledBox } from "@mishieck/ink-titled-box";
import { type FC } from "react";
import { useConfig } from "@contexts/ConfigContext";
import { TextInput } from "@components/TextInput";

type Props = {
  input: string;
  onInputChange: (input: string) => void;
  hasFocus: boolean;
  titles: string[];
};

export const BorderedTextInput: FC<Props> = ({
  input,
  onInputChange,
  hasFocus,
  titles,
}) => {
  const config = useConfig();
  const { colors } = config;
  return (
    <TitledBox
      borderStyle="single"
      titles={titles}
      width={100}
      borderColor={hasFocus ? colors.focusedBorder : colors.unfocusedBorder}
    >
      <TextInput value={input} onChange={onInputChange} focus={hasFocus} />
    </TitledBox>
  );
};
