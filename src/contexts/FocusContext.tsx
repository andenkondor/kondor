import { Focus } from "@definitions/Focus";
import { useInput } from "ink";
import { createContext, useState, type ReactNode } from "react";

type FocusProps = {
  currentFocus: Focus;
};

export const FocusContext = createContext<FocusProps>({
  currentFocus: Focus.NONE,
});

export const FocusProvider = ({ children }: { children: ReactNode }) => {
  const [currentFocus, setCurrentFocus] = useState<Focus>(Focus.RG);
  useInput(async (input, key) => {
    if (key.ctrl && input === "g") {
      setCurrentFocus(currentFocus === Focus.FZF ? Focus.RG : Focus.FZF);
    }
  });
  return (
    <FocusContext.Provider value={{ currentFocus }}>
      {children}
    </FocusContext.Provider>
  );
};
