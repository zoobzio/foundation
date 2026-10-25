import type { EditorDefinition } from "../types/components/editor";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates an editor definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineEditor<I, O>(
  definition: EditorDefinition<I, O>,
): EditorDefinition<I, O>;
export function defineEditor<I, O>(
  definition: DefinitionSource<EditorDefinition<I, O>>,
): ComputedRef<EditorDefinition<I, O>>;
export function defineEditor<I, O>(
  definition: EditorDefinition<I, O> | DefinitionSource<EditorDefinition<I, O>>,
): EditorDefinition<I, O> | ComputedRef<EditorDefinition<I, O>> {
  return define(definition);
}
