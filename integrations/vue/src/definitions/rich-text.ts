import type { RichTextDefinition } from "../types/components/rich-text";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a rich text definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineRichText(
  definition: RichTextDefinition,
): RichTextDefinition;
export function defineRichText(
  definition: DefinitionSource<RichTextDefinition>,
): ComputedRef<RichTextDefinition>;
export function defineRichText(
  definition: RichTextDefinition | DefinitionSource<RichTextDefinition>,
): RichTextDefinition | ComputedRef<RichTextDefinition> {
  return define(definition);
}
