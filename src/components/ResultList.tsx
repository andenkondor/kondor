import { type ReactNode } from "react";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { useSpinner } from "@hooks/useSpinner";
import { useResultStatus } from "@hooks/useResultStatus";
import { ResultListContent } from "./ResultListContent";

export const ResultList = (): ReactNode => {
  const {
    layout: { borderType },
  } = useConfig();
  const {
    resultState: { isLoading },
  } = useApplicationState();

  const spinner = useSpinner(isLoading);
  const { statusIndicator } = useResultStatus();

  return (
    <box borderStyle={borderType} title={statusIndicator} width="100%">
      {isLoading ? (
        <box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <text>{spinner}</text>
        </box>
      ) : (
        <ResultListContent />
      )}
    </box>
  );
};
