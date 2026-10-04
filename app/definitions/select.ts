import type { SelectEmits, SelectProps } from "../types/core/select";
import type { Option } from "../types/core/common";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A select instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type SelectDefinition<T extends Option> = Definition<
  SelectProps<T>,
  SelectEmits<T>
>;

/**
 * Declares a select. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineSelect<T extends Option>(
  definition: SelectDefinition<T>,
): SelectDefinition<T>;
export function defineSelect<T extends Option>(
  definition: DefinitionSource<SelectDefinition<T>>,
): ComputedRef<SelectDefinition<T>>;
export function defineSelect<T extends Option>(
  definition: SelectDefinition<T> | DefinitionSource<SelectDefinition<T>>,
): SelectDefinition<T> | ComputedRef<SelectDefinition<T>> {
  return define(definition);
}
