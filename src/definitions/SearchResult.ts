export type SearchResult = {
  id: string;
  filePath: string;
  lineNumber: number;
  lineContent: string;
  subMatches: SubMatch[];
};

type SubMatch = {
  start: number;
  end: number;
};
