import type { CliConfig, Config } from "@contexts/ConfigContext";
import { ConfigSchema } from "@contexts/ConfigSchema";
import { load } from "js-yaml";
import { merge } from "lodash";
import { ZodError } from "zod";
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
	let settingsConfig: Partial<Config> = {};

	try {
		const yamlText = await Bun.file(settingsPath).text();
		const parsed = load(yamlText) as Record<string, unknown>;
		settingsConfig = ConfigSchema.partial().parse(parsed);
	} catch (e) {
		if (e instanceof ZodError) {
			throw e;
		}
		// settings file is optional — ignore I/O errors
	}

	return ConfigSchema.parse(
		merge({}, defaultConfig, settingsConfig, cliConfig),
	);
};
