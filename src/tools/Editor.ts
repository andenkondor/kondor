import { tmpdir } from "node:os";
import { basename } from "node:path";
import type { SearchResult } from "@definitions/SearchResult";
import type { CliRenderer } from "@opentui/core";
import { spawnSync } from "bun";

export class Editor {
	private static isVimCompatible(editor: string): boolean {
		const name = basename(editor.split(" ")[0] ?? editor);
		return name === "nvim" || name === "vim";
	}

	private static resolve(): { cmd: string[]; isVim: boolean } {
		const envEditor = process.env.EDITOR;
		if (envEditor) {
			const cmd = envEditor.split(/\s+/);
			return { cmd, isVim: Editor.isVimCompatible(cmd[0] ?? "") };
		}

		if (Bun.which("nvim")) {
			return { cmd: ["nvim"], isVim: true };
		}

		return { cmd: ["vim"], isVim: true };
	}

	static async open(item: SearchResult, renderer: CliRenderer) {
		const { cmd, isVim } = Editor.resolve();

		renderer.suspend();

		if (isVim) {
			spawnSync(
				[
					...cmd,
					`+call cursor(${item.lineNumber}, ${item.getFirstMatch().start + 1})`,
					item.filePath,
				],
				{
					stdout: "inherit",
					stdin: "inherit",
					stderr: "inherit",
				},
			);
		} else {
			spawnSync([...cmd, item.filePath], {
				stdout: "inherit",
				stdin: "inherit",
				stderr: "inherit",
			});
		}

		renderer.resume();
	}

	static async openMultiple(items: SearchResult[], renderer: CliRenderer) {
		if (items.length === 0) {
			throw new Error("No results to open");
		}

		const { cmd, isVim } = Editor.resolve();

		if (!isVim) {
			Editor.open(items[0] as SearchResult, renderer);
			return;
		}

		renderer.suspend();

		const tmpFile = `${tmpdir()}/kondor-quickfix-${Date.now()}.txt`;
		const content = items
			.map(
				(item) =>
					`${item.filePath}:${item.lineNumber}:${item.getFirstMatch().start + 1}:${item.lineContent.trimEnd()}`,
			)
			.join("\n");

		await Bun.write(tmpFile, content);

		spawnSync([...cmd, "+copen", "-q", tmpFile], {
			stdout: "inherit",
			stdin: "inherit",
			stderr: "inherit",
		});

		renderer.resume();
	}
}
