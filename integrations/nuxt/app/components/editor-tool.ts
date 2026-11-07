// The tool glue the editor and rich text wrappers share: the layer under
// `pt.tool` that names each button in the visitor's locale, the label slot
// that draws its icon, and the block type dropdown's trigger and items in
// the visitor's locale. It sits with the wrappers, as `icon.ts` and
// `text.ts` do, because it renders through them; `utils/editor` holds the
// lookups alone, which the factories reach without a Nuxt app.
import type {
  EditorBlock,
  EditorTool,
} from "@zoobzio/vue/types/components/editor";
import type { VNode } from "vue";

import { icon, iconOf } from "./icon";
import { text, textIn, textSlot } from "./text";
import { toolIcon, toolText } from "../utils/editor";

/**
 * The label of a tool as the visitor reads it: the contract's message for
 * a tool the layer names, the tool's own label otherwise.
 */
const labelOf = (tool: EditorTool): string =>
  text(toolText(tool.key) ?? tool.label);

/**
 * The layer under the editor's `pt.tool`: the resolved label as the Fab's
 * accessible name, and as the button's `title`, so an icon-only button
 * still says what it does on hover.
 */
export const toolLayer = (
  tool: EditorTool,
): { label: string; title: string } => {
  const label = labelOf(tool);
  return { label, title: label };
};

/**
 * The content of a tool's button: its icon where the layer names one, so
 * the button is icon-only, and the resolved label as text otherwise.
 */
export const toolLabel = (tool: EditorTool): VNode[] => {
  const name = toolIcon(tool.key);
  return name ? iconOf(name) : textSlot(toolText(tool.key) ?? tool.label);
};

/**
 * The text of a block type as the visitor reads it: the contract's message
 * for the paragraph and the headings, the entry's own label otherwise.
 */
const blockText = (block: EditorBlock): VNode[] =>
  textSlot(toolText(block.value) ?? block.label);

/**
 * The trigger of the block type dropdown: the block at the selection by
 * name, in a span as the editor's own trigger renders it.
 */
export const blockLabel = (block: EditorBlock): VNode[] =>
  textIn("span", "f-span", toolText(block.value) ?? block.label);

/** The `expand` icon after the trigger's text, as a select's trigger draws it. */
export const blockAppend = (): VNode[] => [icon("expand")];

/** One entry of the block type dropdown, by name. */
export const blockItemLabel = (item: EditorBlock): VNode[] => blockText(item);
