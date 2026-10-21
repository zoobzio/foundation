import type { MultiSelectDefinition } from "../types/core/multi-select";
import type { Option } from "../types/common";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a multi select definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
