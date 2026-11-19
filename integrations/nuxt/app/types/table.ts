import type { Bound } from "./actions";
import type { Hooks } from "./hooks";
import type { MaybeRefOrGetter } from "vue";
import type {
  ActionDescriptor,
  Actions,
  BulkAction,
  Config,
  Events,
  Permissions,
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
 * joined to its descriptor, the fetch mechanism, and the `refresh` that
 * gives the table its sync where there is one. The config's
 * `initialState` and `initialClauses` are what the table starts from: they
 * seed the `useState` record, so they must survive Nuxt's payload.
 */
export type TableOptions<T extends RowData> = Omit<
  Config<T>,
  "actions" | "bulkActions"
> & {
  fetch: Actions<T>["fetch"];
  refresh?: Actions<T>["refresh"];
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
 * call yields a service over the same shared container. The permissions it
 * is given are what this visitor may do, over the options' own: a ref or a
 * getter is read on every check, so the table follows it as it changes.
 */
export type UseTable<T extends RowData> = (
  permissions?: MaybeRefOrGetter<Permissions | undefined>,
) => Service<T>;
