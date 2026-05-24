import { useState } from "react";
import { Focus } from "@definitions/Focus";

export type FocusState = {
  currentFocus: Focus;
};

export const useFocusState = () => {
  const [focusState, setFocusState] = useState<FocusState>({
    currentFocus: Focus.RG,
  });

  return { focusState, setFocusState };
};
