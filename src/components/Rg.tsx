import { type FC } from "react";
import { useFocus } from "@hooks/useFocus";
import { Focus } from "@definitions/Focus";
import { Input } from "@components/Input";

type Props = {
  searchTerm: string;
  onSearchTermChange: (searchTerm: string) => void;
};

export const Rg: FC<Props> = ({ searchTerm, onSearchTermChange }) => {
  const { currentFocus } = useFocus();
  const hasFocus = currentFocus === Focus.RG;

  return (
    <Input
      input={searchTerm}
      onInputChange={onSearchTermChange}
      hasFocus={hasFocus}
      titles={["rg"]}
    />
  );
};
