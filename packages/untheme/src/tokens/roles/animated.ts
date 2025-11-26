import type reference from "../reference/index.js";
import type modes from "../modes/index.js";

type RefToken = keyof typeof reference | keyof typeof modes.light;

/**
 * Animated tokens (transitions/animations)
 */
export default {
  "transition-duration": "ref-duration-fast",
  "transition-easing": "ref-ease-out",
} satisfies Record<string, RefToken>;
