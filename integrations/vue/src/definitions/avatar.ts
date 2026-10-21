import type { AvatarDefinition } from "../types/core/avatar";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

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
