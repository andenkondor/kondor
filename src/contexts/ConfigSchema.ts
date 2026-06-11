import { z } from "zod";

export const ConfigSchema = z.object({
	initialSearchTerm: z.string().default(""),
	inputDebounceDelayMs: z.number().default(300),
	preview: z
		.object({
			showOnStart: z.boolean().default(false),
			layout: z.enum(["right", "bottom"]).default("right"),
		})
		.default({ showOnStart: false, layout: "right" }),
	openers: z
		.array(
			z.object({
				description: z.string(),
				command: z.string(),
				terminal: z.boolean().optional(),
			}),
		)
		.default([]),
	colors: z
		.object({
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
		})
		.default({
			filePathText: "#9E40A1",
			highlightedText: "#FF0000",
			normalText: "#FFFFFF",
			selectedBackground: "#000000",
			focusedBorder: "#00FF00",
			highlightedBorder: "#CCC90A",
			unfocusedBorder: "#FFFFFF",
			popupBackgroundColor: "#000000",
			popupOverlayColor: "#000000C0",
			fileLineNumber: "#00FF00",
			defaultText: "#FFFFFF",
			truncationText: "#0000FF",
			errorBorder: "#FF0000",
		}),
	markSymbol: z.string().default("○"),
	selectionSymbol: z.string().default(">"),
	layout: z
		.object({
			borderType: z
				.enum(["single", "double", "rounded", "heavy"])
				.default("rounded"),
		})
		.default({ borderType: "rounded" }),
});

export type Config = z.infer<typeof ConfigSchema>;
export type PreviewLayout = Config["preview"]["layout"];
