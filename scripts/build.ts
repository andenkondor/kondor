#!/usr/bin/env bun
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "bun";

const platform = process.platform;
const arch = process.arch;

const platformPackageMap: Record<string, Record<string, string>> = {
	darwin: { arm64: "darwin-arm64", x64: "darwin-x64" },
	linux: { x64: "linux-x64", arm64: "linux-arm64" },
};

const platformSuffix = platformPackageMap[platform]?.[arch];
if (!platformSuffix) {
	console.error(`Unsupported platform: ${platform}-${arch}`);
	process.exit(1);
}

const packageName = `@opentui/core-${platformSuffix}`;

// Step 1: clean dist
if (existsSync("./dist")) {
	rmSync("./dist", { recursive: true });
}

// Step 2: bundle
const buildResult = spawnSync(
	[
		"bun",
		"build",
		"--minify",
		"--target=bun",
		`--external=${packageName}`,
		"./index.tsx",
		"--outdir",
		"./dist",
	],
	{
		stdio: ["inherit", "inherit", "inherit"],
	},
);

if (buildResult.exitCode !== 0) {
	process.exit(buildResult.exitCode);
}

// Step 3: copy native package to dist/node_modules
const platformDir = `core-${platformSuffix}`;
const srcDir = `./node_modules/@opentui/${platformDir}`;
const destDir = `./dist/node_modules/@opentui/${platformDir}`;

if (!existsSync(srcDir)) {
	console.error(
		`Native package not found at ${srcDir}. Run 'bun install' first.`,
	);
	process.exit(1);
}

mkdirSync(`./dist/node_modules/@opentui`, { recursive: true });
cpSync(srcDir, destDir, { recursive: true });

console.log(`✓ Build complete for ${platform}-${arch} (${packageName})`);
