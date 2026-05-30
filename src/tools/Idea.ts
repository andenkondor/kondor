import type { SearchResult } from "@definitions/SearchResult";
import { spawn } from "bun";

export class Idea {
	static open(item: SearchResult) {
		spawn(["idea", ...["--line", `${item.lineNumber}`], item.filePath], {
			stdout: "inherit",
			stdin: "inherit",
			stderr: "inherit",
		});
	}
}
