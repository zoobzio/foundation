import type { CodeDefinition } from "../types/components/code";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a code editor definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineCode<I, O>(
  definition: CodeDefinition<I, O>,
): CodeDefinition<I, O>;
export function defineCode<I, O>(
  definition: DefinitionSource<CodeDefinition<I, O>>,
): ComputedRef<CodeDefinition<I, O>>;
export function defineCode<I, O>(
  definition: CodeDefinition<I, O> | DefinitionSource<CodeDefinition<I, O>>,
): CodeDefinition<I, O> | ComputedRef<CodeDefinition<I, O>> {
  return define(definition);
}
