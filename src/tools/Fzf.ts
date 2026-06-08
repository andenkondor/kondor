import { createInterface } from "node:readline";
import { Readable } from "node:stream";
import type { SearchResult } from "@definitions/SearchResult";

export type FzfOptions = {
	filterColumn: "all" | "filePath" | "lineContent";
	isExact: boolean;
};

const delimiter = "\x1f";

export class Fzf {
	static execute(
		input: SearchResult[],
		filterTerm: string,
		options: FzfOptions,
	) {
		const stdin = input
			.map((rg) => [rg.id, rg.filePath, rg.lineContent].join(delimiter))
			.join("\n");

		const withNth =
			options.filterColumn === "all"
				? "2.."
				: options.filterColumn === "filePath"
					? "2"
					: "3";

		const proc = Bun.spawn(
			[
				"fzf",
				...["--accept-nth", "1"],
				...["--with-nth", withNth],
				...["--delimiter", delimiter],
				...(options.isExact ? ["--exact"] : []),
				...["-f", filterTerm],
			],
			{
				stdout: "pipe",
				stderr: "pipe",
				stdin: Buffer.from(stdin),
			},
		);

		const getResult = async () => {
			if (!proc.stdout) {
				throw new Error("fzf stdout stream is not available");
			}

			const [filtered, stderr] = await Promise.all([
				readFzfStdout(proc.stdout as ReadableStream<Uint8Array>),
				proc.stderr
					? new Response(proc.stderr as ReadableStream<Uint8Array>).text()
					: Promise.resolve(""),
			]);

			return {
				results: input.filter((rg) => filtered.has(rg.id)),
				stderr,
			};
		};

		return { proc, getResult };
	}
}

const readFzfStdout = async (
	stream: ReadableStream<Uint8Array>,
): Promise<Set<string>> => {
	const lineReader = createInterface({
		input: Readable.fromWeb(stream),
		crlfDelay: Infinity,
	});
	const filtered = new Set<string>();
	try {
		for await (const line of lineReader) {
			if (line) filtered.add(line);
		}
	} finally {
		lineReader.close();
	}
	return filtered;
};
