import type { ImageInputDefinition } from "../types/components/image-input";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates an image input definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineImageInput(
  definition: ImageInputDefinition,
): ImageInputDefinition;
export function defineImageInput(
  definition: DefinitionSource<ImageInputDefinition>,
): ComputedRef<ImageInputDefinition>;
export function defineImageInput(
  definition: ImageInputDefinition | DefinitionSource<ImageInputDefinition>,
): ImageInputDefinition | ComputedRef<ImageInputDefinition> {
  return define(definition);
}
