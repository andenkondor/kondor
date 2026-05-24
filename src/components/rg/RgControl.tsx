import type { ReactNode } from "react";
import { useRg } from "@hooks/useRg";
import { RgSearchTerm } from "@components/rg/RgSearchTerm";
import { RgCase } from "@components/rg//RgCase";
import { RgWordRegxp } from "@components/rg/RgWordRegexp";
import { RgResultsPerFile } from "@components/rg/RgResultsPerFile";

export const RgControl = (): ReactNode => {
  useRg();
  return (
    <box flexDirection="row">
      <RgSearchTerm />
      <RgCase />
      <RgWordRegxp />
      <RgResultsPerFile />
    </box>
  );
};
