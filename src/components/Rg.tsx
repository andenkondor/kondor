import { type FC } from "react";
import { useFocus } from "@hooks/useFocus";
import { Focus } from "@definitions/Focus";
import { BorderedTextInput } from "./BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useRg } from "@hooks/useRg";

export const Rg: FC = () => {
  useRg();
  const { currentFocus } = useFocus();
  const {
    rgState: { searchTerm },
    setRgState,
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
