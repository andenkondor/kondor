import type { Opener as OpenerConfig } from "@definitions/Opener";
import type { SearchResult } from "@definitions/SearchResult";

const quote = (s: string) => `'${s.replace(/'/g, "'\\''")}'`;

const interpolate = (
	command: string,
	filePath: string,
	lineNumber: number,
	columnNumber: number,
): string =>
	command
		.replace(/\{\{\.SelectedFile\.Name\}\}/g, quote(filePath))
		.replace(/\{\{\.SelectedFile\.LineNumber\}\}/g, String(lineNumber))
		.replace(/\{\{\.SelectedFile\.ColumnNumber\}\}/g, String(columnNumber));

export class Opener {
	static execute(config: OpenerConfig, item: SearchResult) {
		const command = interpolate(
			config.command,
			item.filePath,
			item.lineNumber,
			item.getFirstMatch().start + 1,
		);
		Bun.spawn(["sh", "-c", command], {
			detached: true,
			stdio: ["ignore", "ignore", "ignore"],
		});
	}
}
