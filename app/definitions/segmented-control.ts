import type {
  SegmentedControlEmits,
  SegmentedControlOption,
  SegmentedControlProps,
} from "../types/core/segmented-control";
import type { Definition } from "../types/definition";

/**
 * A segmented-control instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type SegmentedControlDefinition<
  T extends SegmentedControlOption = SegmentedControlOption,
> = Definition<SegmentedControlProps<T>, SegmentedControlEmits>;

/**
 * Declares a segmented-control at module scope — pure data, no runtime, no Vue. The
 * identity function is the type checkpoint: every field errors on the line
 * it is written.
 */
export const defineSegmentedControl = <T extends SegmentedControlOption>(
  definition: SegmentedControlDefinition<T>,
): SegmentedControlDefinition<T> => definition;
