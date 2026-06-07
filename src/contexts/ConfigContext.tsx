import type { Opener } from "@definitions/Opener";
import type { BorderStyle } from "@opentui/core";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

export type Config = {
	initialSearchTerm?: string;
	inputDebounceDelayMs: number;
	previewDebounceDelayMs: number;
	openers: Opener[];
	colors: {
		filePathText: string;
		highlightedText: string;
		normalText: string;
		selectedBackground: string;
		focusedBorder: string;
		highlightedBorder: string;
		unfocusedBorder: string;
		popupBackgroundColor: string;
		fileLineNumber: string;
		defaultText: string;
		truncationText: string;
	};
	markSymbol: string;
	selectionSymbol: string;
	layout: { borderType: BorderStyle };
};

export type CliConfig = Pick<Config, "initialSearchTerm">;

const ConfigContext = createContext<Config | null>(null);

export const ConfigProvider = ({
	value,
	children,
}: {
	value: Config;
	children: ReactNode;
}): ReactNode => {
	return (
		<ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
	);
};

export const useConfig = () => {
	const context = useContext(ConfigContext);
	if (!context) {
		throw new Error("useConfig must be used within a ConfigProvider");
	}
	return context;
};
