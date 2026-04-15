import { useContext } from "react";
import { FocusContext } from "@contexts/FocusContext";

export function useFocus() {
  const context = useContext(FocusContext);

  if (!context) {
    throw new Error("no focus context defined");
  }

  return context;
}
