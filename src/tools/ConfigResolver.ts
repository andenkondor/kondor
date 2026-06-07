import type { CliConfig, Config } from "@contexts/ConfigContext";
import { load } from "js-yaml";
import { merge } from "lodash";
import defaultConfig from "../../config.yaml";

export const resolveConfig = async (): Promise<Config> => {
	const cliArgs = process.argv.slice(2);
	const initialSearchTerm = cliArgs.join(" ");

	const cliConfig: CliConfig = {
		initialSearchTerm,
	};

	const xdgConfigHome =
		process.env.XDG_CONFIG_HOME ?? `${Bun.env.HOME ?? "~"}/.config`;
	const settingsPath = `${xdgConfigHome}/kondor/kondor-settings.yaml`;
	const settingsConfig: Partial<Config> = {};
	try {
		const yamlText = await Bun.file(settingsPath).text();
		const parsed = load(yamlText) as Record<string, unknown>;
		if (parsed?.openers && Array.isArray(parsed.openers)) {
			settingsConfig.openers = parsed.openers as Config["openers"];
		}
	} catch {
		// settings file is optional
	}

	return merge({}, defaultConfig, settingsConfig, cliConfig) as Config;
};
