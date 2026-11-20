import type { TimelineDefinition } from "../types/components/timeline";
import type { DefinitionSource } from "../types/definition";
import type { ComputedRef } from "vue";
import type { RecordData } from "@zoobzio/timeline";

import { define } from "../utils/definition";

/**
 * Creates a timeline definition. A plain object returns as is. A ref or
 * getter returns a computed definition that tracks its source.
 */
export function defineTimeline<T extends RecordData>(
  definition: TimelineDefinition<T>,
): TimelineDefinition<T>;
export function defineTimeline<T extends RecordData>(
  definition: DefinitionSource<TimelineDefinition<T>>,
): ComputedRef<TimelineDefinition<T>>;
export function defineTimeline<T extends RecordData>(
  definition: TimelineDefinition<T> | DefinitionSource<TimelineDefinition<T>>,
): TimelineDefinition<T> | ComputedRef<TimelineDefinition<T>> {
  return define(definition);
}
