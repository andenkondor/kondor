import { useConfig } from "@contexts/ConfigContext";
import type { ReactNode } from "react";

type Props = {
	input: string;
	onInputChange: (input: string) => void;
	hasFocus: boolean;
	titles: string[];
	onMouseDown?: () => void;
};

export const BorderedTextInput = ({
	input,
	onInputChange,
	hasFocus,
	titles,
	onMouseDown,
}: Props): ReactNode => {
	const {
		colors,
		layout: { borderType },
	} = useConfig();

	return (
		<box
			borderStyle={borderType}
			title={titles.join(" ")}
			borderColor={hasFocus ? colors.focusedBorder : colors.unfocusedBorder}
			onMouseDown={onMouseDown}
		>
			<input value={input} onInput={onInputChange} focused={hasFocus} />
		</box>
	);
};
