import type { ScrollerEmits, ScrollerProps } from "../types/core/scroller";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A scroller instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ScrollerDefinition = Definition<ScrollerProps, ScrollerEmits>;

/**
 * Declares a scroller. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineScroller(
  definition: ScrollerDefinition,
): ScrollerDefinition;
export function defineScroller(
  definition: DefinitionSource<ScrollerDefinition>,
): ComputedRef<ScrollerDefinition>;
export function defineScroller(
  definition: ScrollerDefinition | DefinitionSource<ScrollerDefinition>,
): ScrollerDefinition | ComputedRef<ScrollerDefinition> {
  return define(definition);
}
