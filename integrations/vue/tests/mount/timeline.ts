import type { Commit } from "#test/data/timeline";
import type {
  Actions,
  Config,
  FetchParams,
  FetchResult,
  State,
} from "@zoobzio/timeline";

import { reactive } from "vue";
import { vi } from "vitest";
import { TimelineService, createTimelineState } from "@zoobzio/timeline";
import { NOW, fakeCommits } from "#test/data/timeline";

/**
 * A real timeline service over a reactive container, with a `vi.fn()`
 * fetch that pages the fake commits by offset, the offset as the cursor,
 * and a clock held at `NOW`. The shape every consumer builds. A fetch
 * among the actions takes the fake one's place, which is then never
 * called.
 */
export const makeTimeline = (
  config: Config<Commit> = {},
  actions: Partial<Actions<Commit>> = {},
  rows: Commit[] = fakeCommits,
) => {
  const settings: Config<Commit> = {
    key: "sha",
    label: "message",
    limit: 3,
    ...config,
  };
  const state = reactive(createTimelineState(settings)) as State<Commit>;
  const fetch = vi.fn(
    async ({ cursor, limit }: FetchParams): Promise<FetchResult<Commit>> => {
      const from = Number(cursor ?? 0);
      const next = from + limit;
      return {
        data: rows.slice(from, next),
        cursor: next < rows.length ? String(next) : null,
      };
    },
  );
  const service = new TimelineService<Commit>(
    "test-timeline",
    settings,
    state,
    { now: () => NOW, fetch, ...actions },
  );
  return { service, state, fetch };
};
