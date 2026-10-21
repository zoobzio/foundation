import type { ScrollerDefinition } from "../types/components/scroller";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a scroller definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
