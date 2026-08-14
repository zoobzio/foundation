import type { PopoverEmits, PopoverProps } from "../types/core/popover";
import type { Definition } from "../types/definition";

/**
 * A popover instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type PopoverDefinition = Definition<
  PopoverProps,
  PopoverEmits
>;

/**
 * Declares a popover at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const definePopover = (
  definition: PopoverDefinition,
): PopoverDefinition => definition;
