import { type FC } from "react";
import { useFocus } from "@hooks/useFocus";
import { Focus } from "@definitions/Focus";
import { BorderedTextInput } from "@components/BorderedTextInput";

type Props = {
  filterTerm: string;
  onFilterTermChange: (filterTerm: string) => void;
};

export const Fzf: FC<Props> = ({ filterTerm, onFilterTermChange }) => {
  const { currentFocus } = useFocus();
  const hasFocus = currentFocus === Focus.FZF;

  return (
    <BorderedTextInput
      input={filterTerm}
      onInputChange={onFilterTermChange}
      hasFocus={hasFocus}
      titles={["fzf"]}
    />
  );
};
