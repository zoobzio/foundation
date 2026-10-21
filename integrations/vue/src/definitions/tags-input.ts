import type { TagsInputDefinition } from "../types/core/tags-input";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a tags-input. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineTagsInput(
  definition: TagsInputDefinition,
): TagsInputDefinition;
export function defineTagsInput(
  definition: DefinitionSource<TagsInputDefinition>,
): ComputedRef<TagsInputDefinition>;
export function defineTagsInput(
  definition: TagsInputDefinition | DefinitionSource<TagsInputDefinition>,
): TagsInputDefinition | ComputedRef<TagsInputDefinition> {
  return define(definition);
}
