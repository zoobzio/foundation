import type { UseViews, ViewsOptions, ViewsTarget } from "../types/views";
import type { Config, Service } from "@zoobzio/views";

import { useNuxtApp } from "#app";
import { ViewsService } from "@zoobzio/views";
import { accessViews } from "../stores/views";

/**
 * Builds the id-scoped composable of a set of saved views. Call it at
 * module scope: the options split once into the headless config and the
 * storage, and `id` keys everything that follows. Each call of the
 * composable, in setup, takes what the views are over (a table or a
 * browser service, or anything with a `snapshot` and a `restore`), builds
 * a service over the id's shared store that reads and applies through it,
 * and relays its domain events onto the app logger and the Nuxt hook bus
 * under the `views:` prefix. A view's name is not resolved here: the
 * layer's tabs read it from the app's contract where it is a key of it,
 * so the app's own views read in the visitor's locale and a user's stand
 * as typed. The machine itself is `@zoobzio/views`; the Vue views render
 * it through their `service` prop.
 */
export const createViews = <P>(
  id: string,
  options: ViewsOptions<P>,
): UseViews<P> => {
  const { load, save, remove, key, ...config } = options;
  const resolved: Config<P> = config;
  return (target: ViewsTarget<P>): Service<P> => {
    const nuxt = useNuxtApp();
    const log = nuxt.$logger(id);
    const state = accessViews(id, resolved);
    const service = new ViewsService(id, resolved, state, {
      read: () => target.snapshot(),
      apply: (payload) => target.restore(payload),
      load,
      save,
      remove,
      key,
    });
    service.on("initialized", (event) => {
      log.debug("Views initialized", event);
      nuxt.callHook("views:initialized", event);
    });
    service.on("selected", (event) => {
      log.debug("Views selected", event);
      nuxt.callHook("views:selected", event);
    });
    service.on("saved", (event) => {
      log.debug("Views saved", event);
      nuxt.callHook("views:saved", event);
    });
    service.on("renamed", (event) => {
      log.debug("Views renamed", event);
      nuxt.callHook("views:renamed", event);
    });
    service.on("removed", (event) => {
      log.debug("Views removed", event);
      nuxt.callHook("views:removed", event);
    });
    service.on("reverted", (event) => {
      log.debug("Views reverted", event);
      nuxt.callHook("views:reverted", event);
    });
    service.on("failed", (event) => {
      log.debug("Views failed", event);
      nuxt.callHook("views:failed", event);
    });
    return service;
  };
};
