type SubMatch = {
	start: number;
	end: number;
};

export class SearchResult {
	public readonly id: string;
	public readonly filePath: string;
	public readonly lineNumber: number;
	public readonly lineContent: string;
	private _byteSubMatches: SubMatch[];
	private _charSubMatches: SubMatch[] | null = null;

	get subMatches(): SubMatch[] {
		if (!this._charSubMatches) {
			this._charSubMatches = this._byteSubMatches.map((m) => ({
				start: byteToCharOffset(this.lineContent, m.start),
				end: byteToCharOffset(this.lineContent, m.end),
			}));
		}
		return this._charSubMatches;
	}

	getFirstMatch(): SubMatch {
		const first = this.subMatches[0];
		if (!first) {
			throw new Error("No first match found");
		}
		return first;
	}

	constructor(
		input: {
			path: { text: string };
			lines: { text: string };
			line_number: number;
			absolute_offset: number;
			submatches: {
				match: { text: string };
				start: number;
				end: number;
			}[];
		},
		searchParameters: unknown,
	) {
		this.filePath = input.path.text;
		this.lineNumber = input.line_number;
		this.lineContent = input.lines.text ?? "";
		this._byteSubMatches = input.submatches;
		this.id = Bun.hash(
			`${this.filePath}#${this.lineNumber}${JSON.stringify(searchParameters)}`,
		).toString();
	}
}

const byteToCharOffset = (str: string, byteOffset: number): number => {
	if (!str) {
		return 0;
	}
	let bytePos = 0;
	for (let i = 0; i < str.length; i++) {
		if (bytePos >= byteOffset) return i;
		const codePoint = str.codePointAt(i) ?? 0;
		if (codePoint < 0x80) {
			bytePos += 1;
		} else if (codePoint < 0x800) {
			bytePos += 2;
		} else if (codePoint < 0x10000) {
			bytePos += 3;
		} else {
			bytePos += 4;
			i++;
		}
	}
	return str.length;
};
