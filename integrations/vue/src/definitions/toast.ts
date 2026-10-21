import type { ToastDefinition } from "../types/core/toast";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a toast definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
