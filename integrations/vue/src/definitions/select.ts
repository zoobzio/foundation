import type { SelectDefinition } from "../types/components/select";
import type { Option } from "../types/common";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a select definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
