import { type FC } from "react";
import { Text } from "ink";
import { useConfig } from "@contexts/ConfigContext";

type Props = {
  text: string;
  isSelected?: boolean;
  isHighlighted?: boolean;
  color?: string;
};

export const ResultText: FC<Props> = ({
  text,
  isSelected = false,
  isHighlighted = false,
  color,
}) => {
  const config = useConfig();
  const { colors } = config;

  return (
    <Text
      color={
        Boolean(color)
          ? color
          : Boolean(isHighlighted)
            ? colors.highlightedText
            : colors.normalText
      }
      backgroundColor={
        isSelected ? colors.selectedBackground : colors.unselectedBackground
      }
    >
      {text}
    </Text>
  );
};
