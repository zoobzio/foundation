import type reference from "#untheme/reference";
import type modes from "#untheme/modes";

type RefToken = keyof typeof reference | keyof typeof modes.light;

/**
 * Position tokens
 */
export default {
  position: "ref-ignore",
  top: "ref-ignore",
  right: "ref-ignore",
  bottom: "ref-ignore",
  left: "ref-ignore",
  "z-index": "ref-ignore",
} satisfies Record<string, RefToken>;
