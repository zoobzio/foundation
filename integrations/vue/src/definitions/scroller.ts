import type { ScrollerDefinition } from "../types/core/scroller";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

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
