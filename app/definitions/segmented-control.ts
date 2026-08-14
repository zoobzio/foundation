import type { SegmentedControlEmits, SegmentedControlProps } from "#foundation/types/core/segmented-control";
import type { Definition } from "#foundation/types/definition";

/**
 * A segmented-control instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type SegmentedControlDefinition = Definition<
  SegmentedControlProps,
  SegmentedControlEmits
>;

/**
 * Declares a segmented-control at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineSegmentedControl = (
  definition: SegmentedControlDefinition,
): SegmentedControlDefinition => definition;
