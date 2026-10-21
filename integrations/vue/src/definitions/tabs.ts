import type { TabsDefinition, TabsOption } from "../types/core/tabs";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a tabs. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
