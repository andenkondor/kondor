type BatOptions = {
	highlightedLine: number;
	fromLine: number;
	toLine: number;
};

export class Bat {
	static async show(
		filePath: string,
		{ highlightedLine, fromLine, toLine }: BatOptions,
	): Promise<string> {
		const proc = Bun.spawn(
			[
				"bat",
				"--squeeze-blank",
				...["--highlight-line", highlightedLine.toString()],
				...["--color", "always"],
				...["--line-range", `${fromLine}:${toLine}`],
				filePath,
			],
			{
				stdout: "pipe",
				stderr: "inherit",
			},
		);

		if (!proc.stdout) {
			throw new Error("bat stdout stream is not available");
		}

		return new Response(proc.stdout).text();
	}
}
