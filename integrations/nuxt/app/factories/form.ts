import type { FormOptions, UseForm } from "../types/form";
import type { Actions, Service } from "@zoobzio/form";

import { useNuxtApp } from "#imports";
import { FormService } from "@zoobzio/form";
import { accessForm } from "../stores/form";

/**
 * Builds the id-scoped composable of a form. Call it at module scope: the
 * options split once into the headless config and the wiring (the
 * lifecycle actions and the middleware), and `id` keys everything that
 * follows. Each call of the composable, in setup, builds a service over
 * the id's shared store and relays its domain events onto the Nuxt hook
 * bus under the `form:` prefix. The machine itself is `@zoobzio/form`; the
 * Vue form renders it through its `service` prop.
 */
export const createForm = <T>(
  id: string,
  options: FormOptions<T>,
): UseForm<T> => {
  const { init, submit, middleware, initial, ...config } = options;
  const wiring: Actions<T> = { init, submit, middleware };
  return (): Service<T> => {
    const nuxt = useNuxtApp();
    const state = accessForm(id, config, initial);
    const service = new FormService(id, config, state, wiring);
    service.on("initialized", (event) =>
      nuxt.callHook("form:initialized", event),
    );
    service.on("submitted", (event) => nuxt.callHook("form:submitted", event));
    service.on("rejected", (event) => nuxt.callHook("form:rejected", event));
    service.on("restored", (event) => nuxt.callHook("form:restored", event));
    service.on("reset", (event) => nuxt.callHook("form:reset", event));
    service.on("failed", (event) => nuxt.callHook("form:failed", event));
    return service;
  };
};
