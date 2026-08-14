import type { AvatarEmits, AvatarProps } from "../types/core/avatar";
import type { Definition } from "../types/definition";

/**
 * A avatar instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type AvatarDefinition = Definition<
  AvatarProps,
  AvatarEmits
>;

/**
 * Declares a avatar at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineAvatar = (
  definition: AvatarDefinition,
): AvatarDefinition => definition;
