#!/usr/bin/env bun

import { App } from "@components/App";
import { ApplicationStateProvider } from "@contexts/ApplicationStateContext";
import { ConfigProvider } from "@contexts/ConfigContext";
import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { resolveConfig } from "@tools/ConfigResolver";

const config = await resolveConfig();

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
