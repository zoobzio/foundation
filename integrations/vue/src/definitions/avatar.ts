import type { AvatarDefinition } from "../types/core/avatar";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates an avatar definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
