import type { DialogEmits, DialogProps } from "../types/core/dialog";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A dialog instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type DialogDefinition = Definition<DialogProps, DialogEmits>;

/**
 * Declares a dialog. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
