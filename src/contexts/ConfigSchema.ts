import { type ColorInput, RGBA } from "@opentui/core";
import { z } from "zod";

const resolveColor = (v: string | number): ColorInput =>
	typeof v === "number" ? RGBA.fromIndex(v) : v;

const resolveColorOptional = (
	v: string | number | undefined,
): ColorInput | undefined => (v != null ? resolveColor(v) : undefined);

const rawColorsSchema = z.object({
	filePathText: z.union([z.string(), z.number()]).default(5),
	highlightedText: z.union([z.string(), z.number()]).default(9),
	selectedBackground: z.union([z.string(), z.number()]).default(8),
	focusedBorder: z.union([z.string(), z.number()]).default(2),
	highlightedBorder: z.union([z.string(), z.number()]).default(3),
	unfocusedBorder: z.union([z.string(), z.number()]).default(7),
	defaultText: z.union([z.string(), z.number()]).optional(),
	popupBackground: z.union([z.string(), z.number()]).default(0),
	popupOverlay: z.string().default("#00000080"),
	fileLineNumberText: z.union([z.string(), z.number()]).default(6),
	truncationText: z.union([z.string(), z.number()]).default(4),
	errorBorder: z.union([z.string(), z.number()]).default(1),
});

type RawColors = z.infer<typeof rawColorsSchema>;

export type ResolvedColors = {
	[K in keyof RawColors]: K extends "popupOverlay"
		? string
		: K extends "defaultText"
			? ColorInput | undefined
			: ColorInput;
};

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
	colors: rawColorsSchema
		.default({
			filePathText: 5,
			highlightedText: 9,
			selectedBackground: 8,
			focusedBorder: 2,
			highlightedBorder: 3,
			unfocusedBorder: 7,
			popupBackground: 0,
			popupOverlay: "#00000080",
			fileLineNumberText: 6,
			truncationText: 4,
			errorBorder: 1,
		})
		.transform((raw) => {
			return {
				filePathText: resolveColor(raw.filePathText),
				highlightedText: resolveColor(raw.highlightedText),
				selectedBackground: resolveColor(raw.selectedBackground),
				focusedBorder: resolveColor(raw.focusedBorder),
				highlightedBorder: resolveColor(raw.highlightedBorder),
				unfocusedBorder: resolveColor(raw.unfocusedBorder),
				defaultText: resolveColorOptional(raw.defaultText),
				popupBackground: resolveColor(raw.popupBackground),
				popupOverlay: raw.popupOverlay,
				fileLineNumberText: resolveColor(raw.fileLineNumberText),
				truncationText: resolveColor(raw.truncationText),
				errorBorder: resolveColor(raw.errorBorder),
			} satisfies ResolvedColors;
		}),
	markSymbol: z.string().default("○"),
	selectionSymbol: z.string().default(">"),
	borderType: z
		.enum(["single", "double", "rounded", "heavy"])
		.default("rounded"),
});

export type Config = z.infer<typeof ConfigSchema>;
export type PreviewLayout = Config["preview"]["layout"];
