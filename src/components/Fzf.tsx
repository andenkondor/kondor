import { type FC } from "react";
import { useFocus } from "@hooks/useFocus";
import { Focus } from "@definitions/Focus";
import { BorderedTextInput } from "@components/BorderedTextInput";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useFzf } from "@hooks/useFzf";

export const Fzf: FC = () => {
  useFzf();
  const { currentFocus } = useFocus();
  const {
    fzfState: { filterTerm },
    setFzfState,
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
