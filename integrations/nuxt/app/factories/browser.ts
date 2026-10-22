import type { BrowserOptions, UseBrowser } from "../types/browser";
import type { Actions, Config, Service } from "@zoobzio/browser";

import { useNuxtApp } from "#imports";
import { BrowserService } from "@zoobzio/browser";
import { accessBrowser } from "../stores/browser";
import { split } from "../utils/actions";

/**
 * Builds the id-scoped composable of a browser. Call it at module scope:
 * the options split once into the headless config (the descriptors) and
 * the wiring (the fetch and the handlers), and `id` keys everything that
 * follows. Each call of the composable, in setup, builds a service over
 * the id's shared store and relays its domain events onto the Nuxt hook
 * bus as `browser:updated` and `browser:navigated`. The machine itself is
 * `@zoobzio/browser`; the Vue browser renders it through its `service`
 * prop.
 */
export const createBrowser = <T>(
  id: string,
  options: BrowserOptions<T>,
): UseBrowser<T> => {
  const { fetch, actions, folderActions, bulkActions, initial, ...rest } =
    options;
  const files = split(actions);
  const folders = split(folderActions);
  const bulk = split(bulkActions);
  const config: Config<T> = {
    ...rest,
    actions: files.descriptors,
    folderActions: folders.descriptors,
    bulkActions: bulk.descriptors,
  };
  const wiring: Actions<T> = {
    fetch,
    actions: files.handlers,
    folderActions: folders.handlers,
    bulkActions: bulk.handlers,
  };
  return (): Service<T> => {
    const nuxt = useNuxtApp();
    const state = accessBrowser<T>(id, initial);
    const service = new BrowserService(id, config, state, wiring);
    service.on("updated", (event) => nuxt.callHook("browser:updated", event));
    service.on("navigated", (event) =>
      nuxt.callHook("browser:navigated", event),
    );
    return service;
  };
};
