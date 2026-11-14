import type { Actions, Config, Doc, State } from "@zoobzio/calendar";

import { reactive } from "vue";
import { vi } from "vitest";
import { CalendarService, createCalendarState, json } from "@zoobzio/calendar";
import { NOW, fakeEntries } from "#test/data/calendar";

/**
 * A real calendar service over a reactive container, in the calendar's
 * own form, with a `vi.fn()` fetch that resolves the fake entries and a
 * clock held at `NOW`. The shape every consumer builds.
 */
export const makeCalendar = (
  config: Config = {},
  actions: Partial<Actions<Doc, Doc>> = {},
  entries: Doc = fakeEntries,
) => {
  const state: State = reactive(createCalendarState(config, () => NOW));
  const fetch = actions.fetch ?? vi.fn(async () => entries);
  const service = new CalendarService<Doc, Doc>(
    "test-calendar",
    config,
    state,
    {
      ...json,
      now: () => NOW,
      ...actions,
      fetch,
    },
  );
  return { service, state, fetch };
};
