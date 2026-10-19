/**
 * The deck domain contract lives in the headless `@zoobzio/deck` package.
 * Re-exported here so layer modules and consumers keep one import path.
 */
export type {
  Actions,
  Change,
  Changes,
  Config,
  DataDeckFetchParams,
  DataDeckFetchResult,
  DateFieldConfig,
  Event,
  Listener,
  MatchMode,
  Middleware,
  Options,
  Service,
  State,
  StateKey,
} from "@zoobzio/deck";

export type { Events as ServiceEvents } from "@zoobzio/deck";

/**
 * The Nuxt hook map of a deck: the service's domain events, prefixed and
 * id-scoped, as `useDeck` relays them onto the app hook bus.
 */
export type Events = {
  "deck:updated": (event: { id: string; count: number }) => void;
  "deck:polled": (event: { id: string; count: number }) => void;
  "deck:failed": (event: { id: string; cause: unknown }) => void;
};
