import type { MenuDefinition, MenuItem } from "../types/core/menu";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a menu definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineMenu<T extends MenuItem>(
  definition: MenuDefinition<T>,
): MenuDefinition<T>;
export function defineMenu<T extends MenuItem>(
  definition: DefinitionSource<MenuDefinition<T>>,
): ComputedRef<MenuDefinition<T>>;
export function defineMenu<T extends MenuItem>(
  definition: MenuDefinition<T> | DefinitionSource<MenuDefinition<T>>,
): MenuDefinition<T> | ComputedRef<MenuDefinition<T>> {
  return define(definition);
}
