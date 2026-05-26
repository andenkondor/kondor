import type { ReactNode } from "react";
import { useRg } from "@hooks/useRg";
import { RgSearchTerm } from "@components/rg/RgSearchTerm";
import { RgCase } from "@components/rg//RgCase";
import { RgWordRegxp } from "@components/rg/RgWordRegexp";
import { RgResultsPerFile } from "@components/rg/RgResultsPerFile";

export const RgControl = (): ReactNode => {
  useRg();
  return (
    <box flexDirection="row" flexWrap="wrap">
      <box flexBasis={75} minWidth={10} flexGrow={0} flexShrink={1}>
        <RgSearchTerm />
      </box>
      <box flexShrink={0}>
        <RgCase />
      </box>
      <box flexShrink={0}>
        <RgWordRegxp />
      </box>
      <box flexShrink={0}>
        <RgResultsPerFile />
      </box>
    </box>
  );
};
