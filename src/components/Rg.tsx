import { type FC } from "react";
import { useFocus } from "@hooks/useFocus";
import { Focus } from "@definitions/Focus";
import { BorderedTextInput } from "./BorderedTextInput";

type Props = {
  searchTerm: string;
  onSearchTermChange: (searchTerm: string) => void;
};

export const Rg: FC<Props> = ({ searchTerm, onSearchTermChange }) => {
  const { currentFocus } = useFocus();
  const hasFocus = currentFocus === Focus.RG;

  return (
    <BorderedTextInput
      input={searchTerm}
      onInputChange={onSearchTermChange}
      hasFocus={hasFocus}
      titles={["rg"]}
    />
  );
};
