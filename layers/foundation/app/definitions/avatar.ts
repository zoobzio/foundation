import type { AvatarEmits, AvatarProps } from "../types/core/avatar";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A avatar instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type AvatarDefinition = Definition<AvatarProps, AvatarEmits>;

/**
 * Declares a avatar. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineAvatar(definition: AvatarDefinition): AvatarDefinition;
export function defineAvatar(
  definition: DefinitionSource<AvatarDefinition>,
): ComputedRef<AvatarDefinition>;
export function defineAvatar(
  definition: AvatarDefinition | DefinitionSource<AvatarDefinition>,
): AvatarDefinition | ComputedRef<AvatarDefinition> {
  return define(definition);
}
