import type { Hooks } from "./hooks";
import type {
  BROWSER_VIEW_SCHEMA,
  TABLE_VIEW_SCHEMA,
} from "../constants/views";
import type { Actions, Config, Events, Service } from "@zoobzio/views";
import type { z } from "zod";

/**
 * The payload of a table's saved view, as `TABLE_VIEW_SCHEMA` yields it:
 * the table's `Snapshot`.
 */
export type TableView = z.output<typeof TABLE_VIEW_SCHEMA>;

/**
 * The payload of a browser's saved view, as `BROWSER_VIEW_SCHEMA` yields
 * it: the browser's `Snapshot`.
 */
export type BrowserView = z.output<typeof BROWSER_VIEW_SCHEMA>;

/**
 * What views are over: anything that yields its arrangement and takes one
 * back. A table service and a browser service are each one. `snapshot`
 * must read reactive state for the drift to show.
 */
export type ViewsTarget<P> = {
  snapshot(): P;
  restore(payload: P): void;
};

/**
 * What `createViews` takes: the headless config and the storage. The
 * config's `views` seed the `useState` record, so their payloads must
 * survive Nuxt's payload. `read` and `apply` are not among the options:
 * the composable is handed the target they reach.
 */
export type ViewsOptions<P> = Config<P> &
  Pick<Actions<P>, "load" | "save" | "remove" | "key">;

/**
 * The Nuxt hooks the views relay, under the `views:` prefix, each carrying
 * the service's payload with its scoping `id`.
 */
export type ViewsHooks = Hooks<"views", Events<unknown>>;

/**
 * The id-scoped composable `createViews` returns. Call it in setup with
 * what the views are over; every call yields a service over the same
 * shared container.
 */
export type UseViews<P> = (target: ViewsTarget<P>) => Service<P>;
