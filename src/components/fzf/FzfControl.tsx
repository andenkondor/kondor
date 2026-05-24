import type { ReactNode } from "react";
import { useFzf } from "@hooks/useFzf";
import { FzfFilterTerm } from "@components/fzf/FzfFilterTerm";
import { FzfFilterColumn } from "@components/fzf/FzfFilterColumn";

export const FzfControl = (): ReactNode => {
  useFzf();

  return (
    <box flexDirection="row">
      <FzfFilterTerm />
      <FzfFilterColumn />
    </box>
  );
};
