import type { MenuEmits, MenuProps } from "#foundation/types/core/menu";
import type { Definition } from "#foundation/types/definition";

/**
 * A menu instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type MenuDefinition = Definition<
  MenuProps,
  MenuEmits
>;

/**
 * Declares a menu at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineMenu = (
  definition: MenuDefinition,
): MenuDefinition => definition;
