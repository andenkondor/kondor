import { type FC } from "react";
import { useFzf } from "@hooks/useFzf";
import { Box } from "ink";
import { FzfFilterColumn } from "@components/fzf/FzfFilterColumn";
import { FzfFilterTerm } from "@components/fzf/FzfFilterTerm";

export const FzfControl: FC = () => {
  useFzf();

  return (
    <Box>
      <FzfFilterTerm />
      <FzfFilterColumn />
    </Box>
  );
};
