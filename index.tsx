#!/usr/bin/env bun

import { App } from "@components/App";
import { ApplicationStateProvider } from "@contexts/ApplicationStateContext";
import {
	type CliConfig,
	type Config,
	ConfigProvider,
} from "@contexts/ConfigContext";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { merge } from "lodash";
import defaultConfig from "./config.json";

const cliArgs = process.argv.slice(2);
const initialSearchTerm = cliArgs.join(" ");

const cliConfig: CliConfig = {
	initialSearchTerm,
};

const config = merge({}, defaultConfig, cliConfig) as Config;

const renderer = await createCliRenderer({
	exitOnCtrlC: true,
});

createRoot(renderer).render(
	<ConfigProvider value={config}>
		<ApplicationStateProvider>
			<App />
		</ApplicationStateProvider>
	</ConfigProvider>,
);
