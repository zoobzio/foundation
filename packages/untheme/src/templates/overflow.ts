import type reference from "#untheme/reference";
import type modes from "#untheme/modes";

type RefToken = keyof typeof reference | keyof typeof modes.light;

/**
 * Overflow tokens
 */
export default {
  "overflow-x": "ref-ignore",
  "overflow-y": "ref-ignore",
} satisfies Record<string, RefToken>;
