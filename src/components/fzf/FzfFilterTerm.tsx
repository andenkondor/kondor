import type { ReactNode } from "react";
import { Focus } from "@definitions/Focus";
import { BorderedTextInput } from "@components/BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";

export const FzfFilterTerm = (): ReactNode => {
  const {
    fzfState: { filterTerm },
    setFzfState,
    focusState: { currentFocus },
  } = useApplicationState();

  const hasFocus = currentFocus === Focus.FZF;
  const onFilterTermChange = (filterTerm: string) => {
    setFzfState((prev) => ({ ...prev, filterTerm }));
  };

  return (
    <BorderedTextInput
      input={filterTerm}
      onInputChange={onFilterTermChange}
      hasFocus={hasFocus}
      titles={["fzf", ...(!hasFocus ? ["⌃G"] : [])]}
    />
  );
};
