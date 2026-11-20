import type { TimelineInitial } from "../types/timeline";
import type { Config, RecordData, State } from "@zoobzio/timeline";

import { useState } from "#app";
import { createTimelineState } from "@zoobzio/timeline";
import { seed } from "../utils/state";

/**
 * The Nuxt backing for a timeline's state container: one `useState` record
 * keyed `timeline-<id>`. Its value is a reactive proxy, so the service's
 * field writes are tracked; instances sharing an id share the container
 * across the app, and it survives SSR hydration, the records the server
 * fetched and the cursor after them included. `config` and `initial`
 * shape the record once, when it is first created; later calls under the
 * same id get the record as it stands.
 */
export const accessTimeline = <T extends RecordData>(
  id: string,
  config: Config<T> = {},
  initial?: TimelineInitial<T>,
): State<T> =>
  useState<State<T>>(`timeline-${id}`, () =>
    seed(createTimelineState(config), initial),
  ).value;
