import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import { SearchResult } from "@definitions/SearchResult";

export type RgOptions = {
	case: "--smart-case" | "--case-sensitive";
	wordRegexp: boolean;
	resultsPerFile?: number;
	singleMatchPerResult: boolean;
	unrestricted: number;
};

export class Rg {
	static execute(searchTerm: string, options: RgOptions) {
		const proc = Bun.spawn(
			[
				"rg",
				"--column",
				"--fixed-strings",
				"--line-number",
				"--no-heading",
				"--json",
				...["--sort", "path"],
				options.case,
				...(options.wordRegexp ? ["--word-regexp"] : []),
				...(options.resultsPerFile != null
					? ["--max-count", String(options.resultsPerFile)]
					: []),
				...(options.unrestricted > 0
					? Array.from({ length: options.unrestricted }, () => "-u")
					: []),
				"--",
				searchTerm,
			],
			{
				stdout: "pipe",
				stderr: "inherit",
			},
		);

		const getResult = async () => {
			if (!proc.stdout) {
				throw new Error("rg stdout stream is not available");
			}

			const lineReader = createInterface({
				input: Readable.fromWeb(proc.stdout as ReadableStream<Uint8Array>),
				crlfDelay: Infinity,
			});
			const rgMatches: RgMatch[] = [];
			try {
				for await (const line of lineReader) {
					if (!line) {
						continue;
					}

					let parsed: unknown;
					try {
						parsed = JSON.parse(line) as unknown;
					} catch {
						continue;
					}
					if (isRgMatch(parsed)) {
						rgMatches.push(parsed);
					}
				}
			} finally {
				lineReader.close();
			}

			return rgMatches.flatMap((match) => {
				if (options.singleMatchPerResult) {
					return match.data.submatches.map(
						(submatch, index) =>
							new SearchResult(
								{
									...match.data,
									submatches: [submatch],
								},
								{ searchTerm, options, submatchIndex: index },
							),
					);
				}
				return [new SearchResult(match.data, { searchTerm, options })];
			});
		};

		return { proc, getResult };
	}
}

type RgMatch = {
	type: "match";
	data: {
		path: { text: string };
		lines: { text: string };
		line_number: number;
		absolute_offset: number;
		submatches: {
			match: { text: string };
			start: number;
			end: number;
		}[];
	};
};

const isRgMatch = (obj: unknown): obj is RgMatch =>
	typeof obj === "object" &&
	obj !== null &&
	"type" in obj &&
	obj.type === "match" &&
	"data" in obj &&
	typeof obj.data === "object" &&
	obj.data !== null &&
	"lines" in obj.data &&
	typeof obj.data.lines === "object" &&
	obj.data.lines !== null &&
	"text" in obj.data.lines;
