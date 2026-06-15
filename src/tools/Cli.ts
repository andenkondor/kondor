import { cac } from "cac";

export interface CliResult {
	searchTerm: string;
}

const VERSION = process.env.KONDOR_VERSION ?? "0.0.0-dev";

export class Cli {
	static async parse(): Promise<CliResult> {
		const cli = cac("kondor");
		cli.version(VERSION);
		cli.help();
		cli.usage("[rg search-term]");
		const parsed = cli.parse(process.argv);

		if (parsed.options.help || parsed.options.version) {
			process.exit(0);
		}

		return {
			searchTerm: parsed.args.length > 0 ? parsed.args.join(" ") : "",
		};
	}
}
