import type { CodeOptions, UseCode } from "../types/code";
import type { Actions, Config, Service } from "@zoobzio/code";

import { useNuxtApp } from "#app";
import { CodeService } from "@zoobzio/code";
import { accessCode } from "../stores/code";

/**
 * Builds the id-scoped composable of a code editor. Call it at module
 * scope: the options split once into the headless config (the feature set)
 * and the actions (the reader, the writer, the extensions), and `id` keys
 * everything that follows. Each call of the composable, in setup, builds a
 * service over the id's shared store and relays its domain events onto the
 * app logger and the Nuxt hook bus under the `code:` prefix. The machine
 * itself is `@zoobzio/code`; the Vue code editor renders it through its
 * `service` prop.
 */
export const createCode = <I, O>(
  id: string,
  options: CodeOptions<I, O>,
): UseCode<I, O> => {
  const { read, write, extensions, ...config } = options;
  const wiring: Actions<I, O> = { read, write, extensions };
  const features: Config = config;
  return (): Service<I, O> => {
    const nuxt = useNuxtApp();
    const log = nuxt.$logger(id);
    const state = accessCode(id);
    const service = new CodeService<I, O>(id, features, state, wiring);
    service.on("loaded", (event) => {
      log.debug("Code loaded", event);
      nuxt.callHook("code:loaded", event);
    });
    service.on("updated", (event) => {
      log.debug("Code updated", event);
      nuxt.callHook("code:updated", event);
    });
    service.on("mounted", (event) => {
      log.debug("Code mounted", event);
      nuxt.callHook("code:mounted", event);
    });
    service.on("unmounted", (event) => {
      log.debug("Code unmounted", event);
      nuxt.callHook("code:unmounted", event);
    });
    return service;
  };
};
