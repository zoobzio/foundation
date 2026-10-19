import type { ToasterEmits, ToasterProps } from "../types/core/toaster";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A toaster instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type ToasterDefinition = Definition<ToasterProps, ToasterEmits>;

/**
 * Declares a toaster. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineToaster(definition: ToasterDefinition): ToasterDefinition;
export function defineToaster(
  definition: DefinitionSource<ToasterDefinition>,
): ComputedRef<ToasterDefinition>;
export function defineToaster(
  definition: ToasterDefinition | DefinitionSource<ToasterDefinition>,
): ToasterDefinition | ComputedRef<ToasterDefinition> {
  return define(definition);
}
