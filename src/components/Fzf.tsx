import { type FC } from "react";
import { Focus } from "@definitions/Focus";
import { BorderedTextInput } from "@components/BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useFzf } from "@hooks/useFzf";

export const Fzf: FC = () => {
  useFzf();
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
      titles={["fzf"]}
    />
  );
};
