import { useConfig } from "@contexts/ConfigContext";
import type { ReactNode } from "react";

type Props = {
	input: string;
	onInputChange: (input: string) => void;
	hasFocus: boolean;
	titles: string[];
	onMouseDown?: () => void;
	disableInput?: boolean;
};

export const BorderedTextInput = ({
	input,
	onInputChange,
	hasFocus,
	titles,
	onMouseDown,
	disableInput = false,
}: Props): ReactNode => {
	const { colors, borderType } = useConfig();

	return (
		<box
			borderStyle={borderType}
			title={titles.join(" ")}
			borderColor={hasFocus ? colors.focusedBorder : colors.unfocusedBorder}
			onMouseDown={onMouseDown}
		>
			<input
				value={input}
				onInput={onInputChange}
				focused={hasFocus && !disableInput}
				textColor={colors.defaultText}
			/>
		</box>
	);
};
