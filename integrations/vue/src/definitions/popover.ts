import type { PopoverDefinition } from "../types/components/popover";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a popover definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function definePopover(definition: PopoverDefinition): PopoverDefinition;
export function definePopover(
  definition: DefinitionSource<PopoverDefinition>,
): ComputedRef<PopoverDefinition>;
export function definePopover(
  definition: PopoverDefinition | DefinitionSource<PopoverDefinition>,
): PopoverDefinition | ComputedRef<PopoverDefinition> {
  return define(definition);
}
