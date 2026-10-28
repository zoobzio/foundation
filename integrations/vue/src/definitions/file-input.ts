import type { FileInputDefinition } from "../types/components/file-input";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a file input definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineFileInput(
  definition: FileInputDefinition,
): FileInputDefinition;
export function defineFileInput(
  definition: DefinitionSource<FileInputDefinition>,
): ComputedRef<FileInputDefinition>;
export function defineFileInput(
  definition: FileInputDefinition | DefinitionSource<FileInputDefinition>,
): FileInputDefinition | ComputedRef<FileInputDefinition> {
  return define(definition);
}
