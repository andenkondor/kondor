import { type ReactNode } from "react";
import type { SearchResult } from "@definitions/SearchResult";
import { useResult } from "@hooks/useResult";
import { useConfig } from "@contexts/ConfigContext";
import { useApplicationState } from "@contexts/ApplicationStateContext";

type Props = {
  item: SearchResult;
  isSelected: boolean;
};

export const ResultLine = ({ item, isSelected }: Props): ReactNode => {
  const {
    colors: { selectedBackground },
  } = useConfig();

  const {
    layoutState: { resultLineMaxLength },
  } = useApplicationState();

  const { segments } = useResult(item, resultLineMaxLength);

  return (
    <box
      flexDirection="row"
      height={1}
      backgroundColor={isSelected ? selectedBackground : undefined}
    >
      <text flexShrink={0}>{isSelected ? "> " : "  "}</text>
      <text>
        {segments.map((segment, index) => (
          <span key={index} fg={segment.color}>
            {segment.text}
          </span>
        ))}
      </text>
    </box>
  );
};
