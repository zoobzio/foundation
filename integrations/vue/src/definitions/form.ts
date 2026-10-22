import type { FormDefinition } from "../types/components/form";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a form definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineForm<T>(definition: FormDefinition<T>): FormDefinition<T>;
export function defineForm<T>(
  definition: DefinitionSource<FormDefinition<T>>,
): ComputedRef<FormDefinition<T>>;
export function defineForm<T>(
  definition: FormDefinition<T> | DefinitionSource<FormDefinition<T>>,
): FormDefinition<T> | ComputedRef<FormDefinition<T>> {
  return define(definition);
}
