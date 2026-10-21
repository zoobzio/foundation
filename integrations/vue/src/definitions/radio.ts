import type { RadioDefinition } from "../types/core/radio";
import type { Option } from "../types/common";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a radio. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineRadio<T extends Option>(
  definition: RadioDefinition<T>,
): RadioDefinition<T>;
export function defineRadio<T extends Option>(
  definition: DefinitionSource<RadioDefinition<T>>,
): ComputedRef<RadioDefinition<T>>;
export function defineRadio<T extends Option>(
  definition: RadioDefinition<T> | DefinitionSource<RadioDefinition<T>>,
): RadioDefinition<T> | ComputedRef<RadioDefinition<T>> {
  return define(definition);
}
