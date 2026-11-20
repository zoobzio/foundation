import type { TimelineOptions, UseTimeline } from "../types/timeline";
import type { Actions, Config, RecordData, Service } from "@zoobzio/timeline";

import { useNuxtApp } from "#app";
import { TimelineService } from "@zoobzio/timeline";
import { QUERY_TEXT_KEY, QUERY_TEXT_LITERAL } from "@zoobzio/query";
import { accessTimeline } from "../stores/timeline";
import { resolveTexts } from "../utils/text";

/**
 * Builds the id-scoped composable of a timeline. Call it at module scope:
 * the options split once into the headless config and the actions (the
 * fetch and the refresh), and `id` keys everything that follows. Each
 * call of the composable, in setup, builds a service over the id's shared
 * store and relays its domain events onto the app logger and the Nuxt
 * hook bus under the `timeline:` prefix. Every text of the config, the
 * labels of the query's fields and literals, resolves through the app's
 * prosary service as the service is built, so a label that is a key of
 * the app's contract reaches the machine as the visitor reads it. A
 * config that searches and names no literals takes the query's text
 * literal under the contract's `timeline.text`. With a `refresh` among
 * the options the timeline has a sync, whose failed polls are logged as
 * warnings. The machine itself is `@zoobzio/timeline`; the Vue timeline
 * renders it through its `service` prop.
 */
export const createTimeline = <T extends RecordData>(
  id: string,
  options: TimelineOptions<T>,
): UseTimeline<T> => {
  const { fetch, refresh, now, initial, ...config } = options;
  const wiring: Actions<T> = {
    fetch,
    ...(refresh && { refresh }),
    now,
  };
  // A timeline that names neither fields nor literals renders no search,
  // and naming the literal here would say it does.
  const searches = config.searchable ?? config.fields !== undefined;
  const settings: Config<T> = {
    ...config,
    ...(searches &&
      config.literals === undefined && {
        literals: {
          [QUERY_TEXT_KEY]: { ...QUERY_TEXT_LITERAL, label: "timeline.text" },
        },
      }),
  };
  return (): Service<T> => {
    const nuxt = useNuxtApp();
    const log = nuxt.$logger(id);
    const resolved = resolveTexts(nuxt.$prosary, settings);
    const state = accessTimeline(id, resolved, initial);
    const service = new TimelineService<T>(id, resolved, state, wiring);
    service.on("loaded", (event) => {
      log.debug("Timeline loaded", event);
      nuxt.callHook("timeline:loaded", event);
    });
    service.on("appended", (event) => {
      log.debug("Timeline appended", event);
      nuxt.callHook("timeline:appended", event);
    });
    service.on("selected", (event) => {
      log.debug("Timeline selected", event);
      nuxt.callHook("timeline:selected", event);
    });
    service.on("filtered", (event) => {
      log.debug("Timeline filtered", event);
      nuxt.callHook("timeline:filtered", event);
    });
    service.on("restored", (event) => {
      log.debug("Timeline restored", event);
      nuxt.callHook("timeline:restored", event);
    });
    // A poll that fails is no one's to catch: it is logged, and the sync
    // keeps its pace.
    service.sync?.on("failed", ({ error }) => {
      log.warn("Timeline sync failed", { error });
    });
    return service;
  };
};
