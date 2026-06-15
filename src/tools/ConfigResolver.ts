import { homedir } from "node:os";
import type { Config } from "@contexts/ConfigContext";
import { ConfigSchema } from "@contexts/ConfigSchema";
import type { CliResult } from "@tools/Cli";
import { load } from "js-yaml";
import { merge } from "lodash";
import { ZodError } from "zod";

export const resolveConfig = async (cliResult: CliResult): Promise<Config> => {
	const config = ConfigSchema.parse({});

	const xdgConfigHome = process.env.XDG_CONFIG_HOME ?? `${homedir()}/.config`;
	const settingsPath = `${xdgConfigHome}/kondor/kondor-settings.yaml`;

	try {
		const yamlText = await Bun.file(settingsPath).text();
		const parsed = load(yamlText) as Record<string, unknown>;
		merge(config, ConfigSchema.partial().parse(parsed));
	} catch (e) {
		if (e instanceof ZodError) {
			throw e;
		}
		// settings file is optional — ignore I/O errors
	}

	if (cliResult.searchTerm) {
		config.initialSearchTerm = cliResult.searchTerm;
	}

	return config;
};
