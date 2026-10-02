import type {
  SegmentedControlEmits,
  SegmentedControlProps,
} from "../types/core/segmented-control";
import type { Option } from "../types/core/common";
import type { Definition } from "../types/definition";

/**
 * A segmented-control instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type SegmentedControlDefinition<T extends Option = Option> = Definition<
  SegmentedControlProps<T>,
  SegmentedControlEmits
>;

/**
 * Declares a segmented-control at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineSegmentedControl = <T extends Option>(
  definition: SegmentedControlDefinition<T>,
): SegmentedControlDefinition<T> => definition;
