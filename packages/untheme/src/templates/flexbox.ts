import type reference from "#untheme/reference";
import type modes from "#untheme/modes";

type RefToken = keyof typeof reference | keyof typeof modes.light;

/**
 * Flex container tokens
 */
export default {
  "flex-direction": "ref-ignore",
  "align-items": "ref-ignore",
  "justify-content": "ref-ignore",
} satisfies Record<string, RefToken>;
