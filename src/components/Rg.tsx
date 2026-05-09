import { type FC } from "react";
import { Focus } from "@definitions/Focus";
import { BorderedTextInput } from "./BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useRg } from "@hooks/useRg";

export const Rg: FC = () => {
  useRg();
  const {
    rgState: { searchTerm },
    setRgState,
    focusState: { currentFocus },
  } = useApplicationState();
  const hasFocus = currentFocus === Focus.RG;

  const onSearchTermChange = (searchTerm: string) => {
    setRgState((prev) => ({ ...prev, searchTerm }));
  };

  return (
    <BorderedTextInput
      input={searchTerm}
      onInputChange={onSearchTermChange}
      hasFocus={hasFocus}
      titles={["rg"]}
    />
  );
};
