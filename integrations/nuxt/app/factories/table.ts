import type { TableOptions, UseTable } from "../types/table";
import type { Actions, Config, Service } from "@zoobzio/table";

import { useNuxtApp } from "#imports";
import { TableService } from "@zoobzio/table";
import { accessTable } from "../stores/table";
import { split } from "../utils/actions";

/**
 * Builds the id-scoped composable of a table. Call it at module scope: the
 * options split once into the headless config (the descriptors) and the
 * wiring (the fetch and the handlers), and `id` keys everything that
 * follows. Each call of the composable, in setup, builds a service over
 * the id's shared store and relays its domain events onto the Nuxt hook
 * bus as `table:updated` and `table:filtered`. The machine itself is
 * `@zoobzio/table`; the Vue table renders it through its `service` prop.
 */
export const createTable = <T>(
  id: string,
  options: TableOptions<T>,
): UseTable<T> => {
  const { fetch, actions, bulkActions, initial, ...rest } = options;
  const rows = split(actions);
  const bulk = split(bulkActions);
  const config: Config<T> = {
    ...rest,
    actions: rows.descriptors,
    bulkActions: bulk.descriptors,
  };
  const wiring: Actions<T> = {
    fetch,
    actions: rows.handlers,
    bulkActions: bulk.handlers,
  };
  return (): Service<T> => {
    const nuxt = useNuxtApp();
    const state = accessTable(id, config, initial);
    const service = new TableService(id, config, state, wiring);
    service.on("updated", (event) => nuxt.callHook("table:updated", event));
    service.on("filtered", (event) => nuxt.callHook("table:filtered", event));
    return service;
  };
};
