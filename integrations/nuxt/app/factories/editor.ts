import type { EditorOptions, UseEditor } from "../types/editor";
import type { Actions, Config, Service } from "@zoobzio/editor";

import { useNuxtApp } from "#app";
import { EditorService } from "@zoobzio/editor";
import { accessEditor } from "../stores/editor";

/**
 * Builds the id-scoped composable of an editor. Call it at module scope:
 * the options split once into the headless config (the feature set) and
 * the actions (the reader, the writer, the extensions), and `id` keys
 * everything that follows. Each call of the composable, in setup, builds a
 * service over the id's shared store and relays its domain events onto the
 * app logger and the Nuxt hook bus under the `editor:` prefix. The machine
 * itself is `@zoobzio/editor`; the Vue editor renders it through its
 * `service` prop.
 */
export const createEditor = <I, O>(
  id: string,
  options: EditorOptions<I, O>,
): UseEditor<I, O> => {
  const { read, write, extensions, ...config } = options;
  const wiring: Actions<I, O> = { read, write, extensions };
  const features: Config = config;
  return (): Service<I, O> => {
    const nuxt = useNuxtApp();
    const log = nuxt.$logger(id);
    const state = accessEditor(id);
    const service = new EditorService<I, O>(id, features, state, wiring);
    service.on("loaded", (event) => {
      log.debug("Editor loaded", event);
      nuxt.callHook("editor:loaded", event);
    });
    service.on("updated", (event) => {
      log.debug("Editor updated", event);
      nuxt.callHook("editor:updated", event);
    });
    service.on("mounted", (event) => {
      log.debug("Editor mounted", event);
      nuxt.callHook("editor:mounted", event);
    });
    service.on("unmounted", (event) => {
      log.debug("Editor unmounted", event);
      nuxt.callHook("editor:unmounted", event);
    });
    return service;
  };
};
