#!/usr/bin/env bun

import { App } from "@components/App";
import { ConfigProvider, type CliConfig } from "@contexts/ConfigContext";
import { FocusProvider } from "@contexts/FocusContext";
import { render } from "ink";
import { merge } from "lodash";
import defaultConfig from "./config.json";

// clear screen and move cursor
process.stdout.write("\u001b[2J\u001b[0;0H");

const cliArgs = process.argv.slice(2);
const initialSearchTerm = cliArgs.join(" ");

const cliConfig: CliConfig = {
  initialSearchTerm,
};

const config = merge({}, defaultConfig, cliConfig);

const { unmount } = render(
  <ConfigProvider value={config}>
    <FocusProvider>
      <App />
    </FocusProvider>
  </ConfigProvider>,
  {
    alternateScreen: true,
  },
);

process.stdin.on("close", () => {
  unmount();
  process.exit(0);
});
