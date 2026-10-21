import type { TabsDefinition, TabsOption } from "../types/components/tabs";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a tabs definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineTabs<T extends TabsOption>(
  definition: TabsDefinition<T>,
): TabsDefinition<T>;
export function defineTabs<T extends TabsOption>(
  definition: DefinitionSource<TabsDefinition<T>>,
): ComputedRef<TabsDefinition<T>>;
export function defineTabs<T extends TabsOption>(
  definition: TabsDefinition<T> | DefinitionSource<TabsDefinition<T>>,
): TabsDefinition<T> | ComputedRef<TabsDefinition<T>> {
  return define(definition);
}
