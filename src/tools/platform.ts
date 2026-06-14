export class Platform {
	static isMac = process.platform === "darwin";

	static getOptKey(): string {
		return Platform.isMac ? "\u2325" : "Opt";
	}

	static getCtrlKey(): string {
		return Platform.isMac ? "\u2303" : "Ctrl";
	}
}
