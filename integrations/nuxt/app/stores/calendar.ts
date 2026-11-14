import type { CalendarInitial } from "../types/calendar";
import type { Config, State } from "@zoobzio/calendar";

import { useState } from "#app";
import { createCalendarState } from "@zoobzio/calendar";
import { seed } from "../utils/state";

/**
 * The Nuxt backing for a calendar's state container: one `useState` record
 * keyed `calendar-<id>`. Its value is a reactive proxy, so the service's
 * field writes are tracked; instances sharing an id share the container
 * across the app, and it survives SSR hydration, the entries the server
 * fetched and the day it read as today included. `config` and `initial`
 * shape the record once, when it is first created; later calls under the
 * same id get the record as it stands.
 */
export const accessCalendar = (
  id: string,
  config: Config = {},
  initial?: CalendarInitial,
): State =>
  useState<State>(`calendar-${id}`, () =>
    seed(createCalendarState(config), initial),
  ).value;
