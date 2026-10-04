import type { ToastEmits, ToastProps } from "../types/core/toast";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A toast instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ToastDefinition = Definition<ToastProps, ToastEmits>;

/**
 * Declares a toast. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineToast(definition: ToastDefinition): ToastDefinition;
export function defineToast(
  definition: DefinitionSource<ToastDefinition>,
): ComputedRef<ToastDefinition>;
export function defineToast(
  definition: ToastDefinition | DefinitionSource<ToastDefinition>,
): ToastDefinition | ComputedRef<ToastDefinition> {
  return define(definition);
}
