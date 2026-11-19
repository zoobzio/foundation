import type { CalendarOptions, UseCalendar } from "../types/calendar";
import type { Actions, Config, Service } from "@zoobzio/calendar";

import { useNuxtApp } from "#app";
import { CalendarService } from "@zoobzio/calendar";
import { QUERY_TEXT_KEY, QUERY_TEXT_LITERAL } from "@zoobzio/query";
import { accessCalendar } from "../stores/calendar";
import { resolveTexts } from "../utils/text";

/**
 * Builds the id-scoped composable of a calendar. Call it at module scope:
 * the options split once into the headless config and the actions (the
 * reader, the writer, the fetch, the save), and `id` keys everything that
 * follows. Each call of the composable, in setup, builds a service over
 * the id's shared store and relays its domain events onto the app logger
 * and the Nuxt hook bus under the `calendar:` prefix. Every text of the
 * config, the labels of the query's fields and literals, resolves through
 * the app's prosary service as the service is built, so a label that is a
 * key of the app's contract reaches the machine, and the search that
 * matches a typed prefix against it, as the visitor reads it. A config
 * that searches and names no literals takes the query's text literal
 * under the contract's `calendar.text`. With a `refresh` among the options
 * the calendar has a sync, whose failed polls are logged as warnings. The
 * machine itself is
 * `@zoobzio/calendar`; the Vue calendar renders it through its `service`
 * prop.
 */
export const createCalendar = <I, O>(
  id: string,
  options: CalendarOptions<I, O>,
): UseCalendar<I, O> => {
  const { read, write, fetch, refresh, save, now, uid, initial, ...config } =
    options;
  const wiring: Actions<I, O> = {
    read,
    write,
    fetch,
    ...(refresh && { refresh }),
    save,
    now,
    uid,
  };
  // A calendar that names neither fields nor literals renders no search,
  // and naming the literal here would say it does.
  const searches = config.searchable ?? config.fields !== undefined;
  const settings: Config = {
    ...config,
    ...(searches &&
      config.literals === undefined && {
        literals: {
          [QUERY_TEXT_KEY]: { ...QUERY_TEXT_LITERAL, label: "calendar.text" },
        },
      }),
  };
  return (): Service<I, O> => {
    const nuxt = useNuxtApp();
    const log = nuxt.$logger(id);
    const resolved = resolveTexts(nuxt.$prosary, settings);
    const state = accessCalendar(id, resolved, initial);
    const service = new CalendarService<I, O>(id, resolved, state, wiring);
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
    service.on("filtered", (event) => {
      log.debug("Calendar filtered", event);
      nuxt.callHook("calendar:filtered", event);
    });
    service.on("restored", (event) => {
      log.debug("Calendar restored", event);
      nuxt.callHook("calendar:restored", event);
    });
    // A poll that fails is no one's to catch: it is logged, and the sync
    // keeps its pace.
    service.sync?.on("failed", ({ error }) => {
      log.warn("Calendar sync failed", { error });
    });
    return service;
  };
};
