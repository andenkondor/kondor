#!/usr/bin/env bun

import { App } from "@components/App";
import { ApplicationStateProvider } from "@contexts/ApplicationStateContext";
import { ConfigProvider } from "@contexts/ConfigContext";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { Cli } from "@tools/Cli";
import { resolveConfig } from "@tools/ConfigResolver";

const cliResult = await Cli.parse();
const config = await resolveConfig(cliResult);

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
