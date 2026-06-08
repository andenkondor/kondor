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

export type RgResult = {
	results: SearchResult[];
	stderr: string;
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
				stderr: "pipe",
			},
		);

		const getResult = async (): Promise<RgResult> => {
			if (!proc.stdout) {
				throw new Error("rg stdout stream is not available");
			}

			const [rgMatches, stderr] = await Promise.all([
				readRgStdout(proc.stdout as ReadableStream<Uint8Array>),
				proc.stderr
					? new Response(proc.stderr as ReadableStream<Uint8Array>).text()
					: Promise.resolve(""),
			]);

			const results = rgMatches.flatMap((match) => {
				if (options.singleMatchPerResult) {
					return match.data.submatches.map(
						(submatch, index) =>
							new SearchResult(
								{ ...match.data, submatches: [submatch] },
								{ searchTerm, options, submatchIndex: index },
							),
					);
				}
				return [new SearchResult(match.data, { searchTerm, options })];
			});

			return { results, stderr };
		};

		return { proc, getResult };
	}
}

const readRgStdout = async (
	stream: ReadableStream<Uint8Array>,
): Promise<RgMatch[]> => {
	const lineReader = createInterface({
		input: Readable.fromWeb(stream),
		crlfDelay: Infinity,
	});
	const rgMatches: RgMatch[] = [];
	try {
		for await (const line of lineReader) {
			if (!line) continue;
			try {
				const parsed = JSON.parse(line) as unknown;
				if (isRgMatch(parsed)) rgMatches.push(parsed);
			} catch {
				// skip non-JSON lines
			}
		}
	} finally {
		lineReader.close();
	}
	return rgMatches;
};

type RgMatch = {
	type: "match";
	data: {
		path: { text: string };
		lines: { text: string };
		line_number: number;
		absolute_offset: number;
		submatches: { match: { text: string }; start: number; end: number }[];
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
