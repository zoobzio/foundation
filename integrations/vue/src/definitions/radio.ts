import type { RadioDefinition } from "../types/components/radio";
import type { Option } from "../types/common";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a radio definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
