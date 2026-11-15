import type { Config, State } from "./types";

/**
 * Builds the initial state container: the config's views, each payload
 * through the schema, with the active view the config's `initial` or the
 * first. The result is a plain object. Wrap it in a reactive proxy to
 * track reads and writes. A config view whose payload fails the schema
 * throws: it is the app's own.
 */
export const createViewsState = <P>(config: Config<P>): State<P> => {
  const views = (config.views ?? []).map((view) => ({
    id: view.id,
    name: view.name,
    origin: view.origin ?? "system",
    payload: config.schema.parse(view.payload),
  }));
  return {
    views,
    stale: [],
    active: config.initial ?? views[0]?.id ?? null,
    pending: null,
    loading: false,
    saving: false,
    initialized: false,
  };
};
