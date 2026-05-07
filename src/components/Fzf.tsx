import { type FC } from "react";
import { useFocus } from "@hooks/useFocus";
import { Focus } from "@definitions/Focus";
import { Input } from "@components/Input";

type Props = {
  filterTerm: string;
  onFilterTermChange: (filterTerm: string) => void;
};

export const Fzf: FC<Props> = ({ filterTerm, onFilterTermChange }) => {
  const { currentFocus } = useFocus();
  const hasFocus = currentFocus === Focus.FZF;

  return (
    <Input
      input={filterTerm}
      onInputChange={onFilterTermChange}
      hasFocus={hasFocus}
      titles={["fzf"]}
    />
  );
};
