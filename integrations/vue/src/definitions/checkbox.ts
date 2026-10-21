import type { CheckboxDefinition } from "../types/core/checkbox";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a checkbox. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineCheckbox(
  definition: CheckboxDefinition,
): CheckboxDefinition;
export function defineCheckbox(
  definition: DefinitionSource<CheckboxDefinition>,
): ComputedRef<CheckboxDefinition>;
export function defineCheckbox(
  definition: CheckboxDefinition | DefinitionSource<CheckboxDefinition>,
): CheckboxDefinition | ComputedRef<CheckboxDefinition> {
  return define(definition);
}
