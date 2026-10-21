import type { FabDefinition } from "../types/core/fab";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a fab definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineFab(definition: FabDefinition): FabDefinition;
export function defineFab(
  definition: DefinitionSource<FabDefinition>,
): ComputedRef<FabDefinition>;
export function defineFab(
  definition: FabDefinition | DefinitionSource<FabDefinition>,
): FabDefinition | ComputedRef<FabDefinition> {
  return define(definition);
}
