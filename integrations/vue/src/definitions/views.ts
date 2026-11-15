import type { ViewsDefinition } from "../types/components/views";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a views definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineViews<P>(
  definition: ViewsDefinition<P>,
): ViewsDefinition<P>;
export function defineViews<P>(
  definition: DefinitionSource<ViewsDefinition<P>>,
): ComputedRef<ViewsDefinition<P>>;
export function defineViews<P>(
  definition: ViewsDefinition<P> | DefinitionSource<ViewsDefinition<P>>,
): ViewsDefinition<P> | ComputedRef<ViewsDefinition<P>> {
  return define(definition);
}
