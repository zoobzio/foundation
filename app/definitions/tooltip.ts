import type { TooltipEmits, TooltipProps } from "../types/core/tooltip";
import type { Definition } from "../types/definition";

/**
 * A tooltip instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type TooltipDefinition = Definition<
  TooltipProps,
  TooltipEmits
>;

/**
 * Declares a tooltip at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineTooltip = (
  definition: TooltipDefinition,
): TooltipDefinition => definition;
