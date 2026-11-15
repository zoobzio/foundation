import type { Bound } from "./actions";
import type { Hooks } from "./hooks";
import type {
  ActionDescriptor,
  Actions,
  BulkAction,
  Config,
  Events,
  RowAction,
  RowData,
  Service,
} from "@zoobzio/table";

/**
 * A row action: its descriptor and its handler, under the config key.
 */
export type TableAction<T extends RowData> = Bound<
  ActionDescriptor,
  RowAction<T>["action"]
>;

/**
 * A bulk action over the selection: its descriptor and its handler, under
 * the config key. The handler is given the ids of the selected rows.
 */
export type TableBulkAction = Bound<ActionDescriptor, BulkAction["action"]>;

/**
 * What `createTable` takes: the headless config with each action's handler
 * joined to its descriptor, and the fetch mechanism. The config's
 * `initialState` and `initialEntries` are what the table starts from: they
 * seed the `useState` record, so they must survive Nuxt's payload.
 */
export type TableOptions<T extends RowData> = Omit<
  Config<T>,
  "actions" | "bulkActions"
> & {
  fetch: Actions<T>["fetch"];
  actions?: Record<string, TableAction<T>>;
  bulkActions?: Record<string, TableBulkAction>;
};

/**
 * The Nuxt hooks a table relays: `table:updated`, `table:filtered`, and
 * `table:restored`, each carrying the service's payload with its scoping `id`.
 */
export type TableHooks = Hooks<"table", Events<RowData>>;

/**
 * The id-scoped composable `createTable` returns. Call it in setup; every
 * call yields a service over the same shared container.
 */
export type UseTable<T extends RowData> = () => Service<T>;
