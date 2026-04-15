import { TitledBox } from "@mishieck/ink-titled-box";
import { type FC } from "react";
import { useConfig } from "@contexts/ConfigContext";
import { TextInput } from "@components/TextInput";

type Props = {
  input: string;
  onInputChange: (input: string) => void;
  hasFocus: boolean;
};

export const Input: FC<Props> = ({ input, onInputChange, hasFocus }) => {
  const config = useConfig();
  const { colors } = config;
  return (
    <TitledBox
      borderStyle="single"
      titles={["rg"]}
      width={100}
      borderColor={hasFocus ? colors.focusedBorder : colors.unfocusedBorder}
    >
      <TextInput value={input} onChange={onInputChange} focus={hasFocus} />
    </TitledBox>
  );
};
