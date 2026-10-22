import type { BrowserDefinition } from "../types/components/browser";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a browser definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineBrowser<T>(
  definition: BrowserDefinition<T>,
): BrowserDefinition<T>;
export function defineBrowser<T>(
  definition: DefinitionSource<BrowserDefinition<T>>,
): ComputedRef<BrowserDefinition<T>>;
export function defineBrowser<T>(
  definition: BrowserDefinition<T> | DefinitionSource<BrowserDefinition<T>>,
): BrowserDefinition<T> | ComputedRef<BrowserDefinition<T>> {
  return define(definition);
}
