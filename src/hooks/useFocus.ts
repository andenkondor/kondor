import { useInput } from "ink";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { Focus } from "@definitions/Focus";

export const useFocus = () => {
  const { setFocusState } = useApplicationState();
  useInput(async (input, key) => {
    if (key.ctrl && input === "g") {
      setFocusState((prev) => ({
        ...prev,
        currentFocus: prev.currentFocus === Focus.FZF ? Focus.RG : Focus.FZF,
      }));
    }
  });
};
