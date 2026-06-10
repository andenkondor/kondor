import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { Config } from "./ConfigSchema";

export type { CliConfig, Config } from "./ConfigSchema";

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
