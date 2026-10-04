import type { MenuEmits, MenuItem, MenuProps } from "../types/core/menu";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A menu instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type MenuDefinition<T extends MenuItem> = Definition<
  MenuProps<T>,
  MenuEmits<T>
>;

/**
 * Declares a menu. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
