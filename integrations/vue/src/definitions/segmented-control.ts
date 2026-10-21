import type {
  SegmentedControlDefinition,
  SegmentedControlOption,
} from "../types/components/segmented-control";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";

import { define } from "../utils/definition";

/**
 * Creates a segmented control definition. A plain object returns as is.
 * A ref or getter returns a computed definition that tracks its source.
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
