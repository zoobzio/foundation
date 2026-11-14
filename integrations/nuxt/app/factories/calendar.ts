import type { CalendarOptions, UseCalendar } from "../types/calendar";
import type { Actions, Config, Service } from "@zoobzio/calendar";

import { useNuxtApp } from "#app";
import { CalendarService } from "@zoobzio/calendar";
import { accessCalendar } from "../stores/calendar";

/**
 * Builds the id-scoped composable of a calendar. Call it at module scope:
 * the options split once into the headless config and the actions (the
 * reader, the writer, the fetch, the save), and `id` keys everything that
 * follows. Each call of the composable, in setup, builds a service over
 * the id's shared store and relays its domain events onto the app logger
 * and the Nuxt hook bus under the `calendar:` prefix. The machine itself
 * is `@zoobzio/calendar`; the Vue calendar renders it through its
 * `service` prop.
 */
export const createCalendar = <I, O>(
  id: string,
  options: CalendarOptions<I, O>,
): UseCalendar<I, O> => {
  const { read, write, fetch, save, now, uid, initial, ...config } = options;
  const wiring: Actions<I, O> = { read, write, fetch, save, now, uid };
  const settings: Config = config;
  return (): Service<I, O> => {
    const nuxt = useNuxtApp();
    const log = nuxt.$logger(id);
    const state = accessCalendar(id, settings, initial);
    const service = new CalendarService<I, O>(id, settings, state, wiring);
    service.on("navigated", (event) => {
      log.debug("Calendar navigated", event);
      nuxt.callHook("calendar:navigated", event);
    });
    service.on("loaded", (event) => {
      log.debug("Calendar loaded", event);
      nuxt.callHook("calendar:loaded", event);
    });
    service.on("changed", (event) => {
      log.debug("Calendar changed", event);
      nuxt.callHook("calendar:changed", event);
    });
    service.on("selected", (event) => {
      log.debug("Calendar selected", event);
      nuxt.callHook("calendar:selected", event);
    });
    return service;
  };
};
