import type reference from "#untheme/reference";
import type modes from "#untheme/modes";

type RefToken = keyof typeof reference | keyof typeof modes.light;

/**
 * Animated tokens (transitions/animations)
 */
export default {
  "transition-duration": "ref-duration-fast",
  "transition-easing": "ref-ease-out",
} satisfies Record<string, RefToken>;
