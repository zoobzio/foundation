import type {
  SegmentedControlEmits,
  SegmentedControlOption,
  SegmentedControlProps,
} from "../types/core/segmented-control";
import type { Definition, DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * A segmented-control instance as data: props plus emit listeners — the object a
 * template `v-bind`s and an adapter captures as settings.
 */
export type SegmentedControlDefinition<
  T extends SegmentedControlOption = SegmentedControlOption,
> = Definition<SegmentedControlProps<T>, SegmentedControlEmits>;

/**
 * Declares a segmented-control. A plain object is returned as is — pure data, storable at
 * module scope; a ref or getter yields a computed definition that tracks
 * its source, so a reactive instance needs no `computed` wrapper. Either
 * way the call is the type checkpoint: a mistyped field errors on the line
 * it is written.
 */
export function defineSegmentedControl<T extends SegmentedControlOption>(
  definition: SegmentedControlDefinition<T>,
): SegmentedControlDefinition<T>;
export function defineSegmentedControl<T extends SegmentedControlOption>(
  definition: DefinitionSource<SegmentedControlDefinition<T>>,
): ComputedRef<SegmentedControlDefinition<T>>;
export function defineSegmentedControl<T extends SegmentedControlOption>(
  definition:
    | SegmentedControlDefinition<T>
    | DefinitionSource<SegmentedControlDefinition<T>>,
): SegmentedControlDefinition<T> | ComputedRef<SegmentedControlDefinition<T>> {
  return define(definition);
}
