import { type FC } from "react";
import { Text } from "ink";
import { useConfig } from "@contexts/ConfigContext";

type Props = {
  text: string;
  isHighlighted?: boolean;
  color?: string;
  wrap?: "truncate-end" | "truncate-middle" | "truncate-start";
};

export const ResultText: FC<Props> = ({
  text,
  isHighlighted = false,
  color,
  wrap,
}) => {
  const { colors } = useConfig();

  return (
    <Text
      wrap={wrap}
      color={
        Boolean(color)
          ? color
          : Boolean(isHighlighted)
            ? colors.highlightedText
            : colors.normalText
      }
    >
      {text}
    </Text>
  );
};
