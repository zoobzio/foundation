import type { TooltipEmits, TooltipProps } from "../types/core/tooltip";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A tooltip instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type TooltipDefinition = Definition<TooltipProps, TooltipEmits>;

/**
 * Declares a tooltip. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineTooltip(definition: TooltipDefinition): TooltipDefinition;
export function defineTooltip(
  definition: DefinitionSource<TooltipDefinition>,
): ComputedRef<TooltipDefinition>;
export function defineTooltip(
  definition: TooltipDefinition | DefinitionSource<TooltipDefinition>,
): TooltipDefinition | ComputedRef<TooltipDefinition> {
  return define(definition);
}
