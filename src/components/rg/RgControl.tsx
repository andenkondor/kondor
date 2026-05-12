import { type FC } from "react";
import { RgSearchTerm } from "@components/rg/RgSearchTerm";
import { useRg } from "@hooks/useRg";
import { RgCase } from "./RgCase";
import { Box } from "ink";

export const RgControl: FC = () => {
  useRg();
  return (
    <Box>
      <RgSearchTerm />
      <RgCase />
    </Box>
  );
};
