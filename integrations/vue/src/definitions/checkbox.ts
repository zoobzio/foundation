import type { CheckboxDefinition } from "../types/components/checkbox";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a checkbox definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
