import type { DialogDefinition } from "../types/components/dialog";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a dialog definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineDialog(definition: DialogDefinition): DialogDefinition;
export function defineDialog(
  definition: DefinitionSource<DialogDefinition>,
): ComputedRef<DialogDefinition>;
export function defineDialog(
  definition: DialogDefinition | DefinitionSource<DialogDefinition>,
): DialogDefinition | ComputedRef<DialogDefinition> {
  return define(definition);
}
