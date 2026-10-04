import type {
  MultiSelectEmits,
  MultiSelectProps,
} from "../types/core/multi-select";
import type { Option } from "../types/core/common";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A multi-select instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type MultiSelectDefinition<T extends Option> = Definition<
  MultiSelectProps<T>,
  MultiSelectEmits<T>
>;

/**
 * Declares a multi-select. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineMultiSelect<T extends Option>(
  definition: MultiSelectDefinition<T>,
): MultiSelectDefinition<T>;
export function defineMultiSelect<T extends Option>(
  definition: DefinitionSource<MultiSelectDefinition<T>>,
): ComputedRef<MultiSelectDefinition<T>>;
export function defineMultiSelect<T extends Option>(
  definition:
    | MultiSelectDefinition<T>
    | DefinitionSource<MultiSelectDefinition<T>>,
): MultiSelectDefinition<T> | ComputedRef<MultiSelectDefinition<T>> {
  return define(definition);
}
