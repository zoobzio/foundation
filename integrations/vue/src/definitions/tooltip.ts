import type { TooltipDefinition } from "../types/components/tooltip";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a tooltip definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
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
