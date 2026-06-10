import { z } from "zod";

export const ConfigSchema = z.object({
	initialSearchTerm: z.string().optional(),
	inputDebounceDelayMs: z.number(),
	preview: z.object({ showOnStart: z.boolean().optional().default(false) }),
	openers: z.array(
		z.object({
			description: z.string(),
			command: z.string(),
			terminal: z.boolean().optional(),
		}),
	),
	colors: z.object({
		filePathText: z.string(),
		highlightedText: z.string(),
		normalText: z.string(),
		selectedBackground: z.string(),
		focusedBorder: z.string(),
		highlightedBorder: z.string(),
		unfocusedBorder: z.string(),
		popupBackgroundColor: z.string(),
		popupOverlayColor: z.string(),
		fileLineNumber: z.string(),
		defaultText: z.string(),
		truncationText: z.string(),
		errorBorder: z.string(),
	}),
	markSymbol: z.string(),
	selectionSymbol: z.string(),
	layout: z.object({
		borderType: z.enum(["single", "double", "rounded", "heavy"]),
	}),
});

export type Config = z.infer<typeof ConfigSchema>;
export type CliConfig = Pick<Config, "initialSearchTerm">;
