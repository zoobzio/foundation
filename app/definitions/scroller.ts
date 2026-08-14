import type { ScrollerEmits, ScrollerProps } from "../types/core/scroller";
import type { Definition } from "../types/definition";

/**
 * A scroller instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ScrollerDefinition = Definition<
  ScrollerProps,
  ScrollerEmits
>;

/**
 * Declares a scroller at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineScroller = (
  definition: ScrollerDefinition,
): ScrollerDefinition => definition;
