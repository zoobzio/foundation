import type { PopoverDefinition } from "../types/core/popover";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Declares a popover. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
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
