import type { FabEmits, FabProps } from "../types/core/fab";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A fab instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type FabDefinition = Definition<FabProps, FabEmits>;

/**
 * Declares a fab. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
