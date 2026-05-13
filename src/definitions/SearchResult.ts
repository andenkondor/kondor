type SubMatch = {
  start: number;
  end: number;
};
export class SearchResult {
  public readonly id: number | bigint;
  public readonly filePath: string;
  public readonly lineNumber: number;
  public readonly lineContent: string;
  public readonly subMatches: SubMatch[];

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
    this.lineContent = input.lines.text;
    this.subMatches = input.submatches;
    this.id = Bun.hash(
      `${this.filePath}#${this.lineNumber}${JSON.stringify(searchParameters)}`,
    );
  }
}
