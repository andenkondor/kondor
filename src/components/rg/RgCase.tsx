import { useRef, type FC } from "react";
import { Text } from "ink";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { TitledBox } from "@mishieck/ink-titled-box";
import { useConfig } from "@contexts/ConfigContext";

export const RgCase: FC = () => {
  const {
    colors: { highlightedBorder },
    layout: { borderType },
  } = useConfig();
  const {
    rgState: { rgOptions },
  } = useApplicationState();
  const initialRef = useRef(rgOptions.case);

  const isInit = initialRef.current === rgOptions.case;
  return (
    <TitledBox
      titles={["⌥1"]}
      borderStyle={borderType}
      borderColor={isInit ? undefined : highlightedBorder}
    >
      <Text>{rgOptions.case}</Text>
    </TitledBox>
  );
};
