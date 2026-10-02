import type { MenuEmits, MenuItem, MenuProps } from "../types/core/menu";
import type { Definition } from "../types/definition";

/**
 * A menu instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type MenuDefinition<T extends MenuItem> = Definition<
  MenuProps<T>,
  MenuEmits<T>
>;

/**
 * Declares a menu at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineMenu = <T extends MenuItem>(
  definition: MenuDefinition<T>,
): MenuDefinition<T> => definition;
