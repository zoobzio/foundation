import type { TimelineGroup } from "../types/components/timeline";
import type { ComputedRef } from "vue";
import type { RecordData, Service } from "@zoobzio/timeline";

import { computed } from "vue";
import { timelineGroups } from "../utils/timeline";

/**
 * The timeline's view model over a service: the groups, each under what
 * its span reads as, with its records as cards read them. `timeline.vue`
 * is one rendering of it; a consumer's own component is another.
 *
 * @param service - The timeline service. Its state container must be
 * reactive for the view model to follow it.
 */
export const useTimeline = <T extends RecordData>(
  service: Service<T>,
): {
  groups: ComputedRef<TimelineGroup<T>[]>;
} => {
  const groups = computed(() => timelineGroups(service));
  return { groups };
};
