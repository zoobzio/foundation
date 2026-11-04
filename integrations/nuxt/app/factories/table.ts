import type { TableOptions, UseTable } from "../types/table";
import type { Actions, Config, Service } from "@zoobzio/table";

import { useNuxtApp } from "#app";
import { QUERY_TEXT_KEY, QUERY_TEXT_LITERAL } from "@zoobzio/query";
import { TableService } from "@zoobzio/table";
import { accessTable } from "../stores/table";
import { split } from "../utils/actions";
import { resolveTexts } from "../utils/text";

/**
 * Builds the id-scoped composable of a table. Call it at module scope: the
 * options split once into the headless config (the descriptors) and the
 * wiring (the fetch and the handlers), and `id` keys everything that
 * follows. Each call of the composable, in setup, builds a service over
 * the id's shared store and relays its domain events onto the app logger and the Nuxt hook
 * bus as `table:updated` and `table:filtered`. Every text of the config —
 * the columns' and the actions' labels, the literals' — resolves through
 * the app's prosary service as the service is built, so a label that is a
 * key of the app's contract reaches the machine — and the search that
 * matches a typed prefix against it — as the visitor reads it. A config
 * that names no literals takes the query's text literal under the
 * contract's `table.text`, so its option reads in the visitor's locale as
 * the search's placeholder does. The machine itself is `@zoobzio/table`;
 * the Vue table renders it through its `service` prop.
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
    literals: rest.literals ?? {
      [QUERY_TEXT_KEY]: { ...QUERY_TEXT_LITERAL, label: "table.text" },
    },
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
    const log = nuxt.$logger(id);
    const resolved = resolveTexts(nuxt.$prosary, config);
    const state = accessTable(id, resolved, initial);
    const service = new TableService(id, resolved, state, wiring);
    service.on("updated", (event) => {
      log.debug("Table updated", event);
      nuxt.callHook("table:updated", event);
    });
    service.on("filtered", (event) => {
      log.debug("Table filtered", event);
      nuxt.callHook("table:filtered", event);
    });
    return service;
  };
};
