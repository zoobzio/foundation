import type { ToasterDefinition } from "../types/core/toaster";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a toaster definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
