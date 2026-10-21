import type { TagsInputDefinition } from "../types/components/tags-input";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a tags input definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
