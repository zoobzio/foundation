import type { Bound } from "./actions";
import type { Hooks } from "./hooks";
import type {
  ActionDescriptor,
  Actions,
  BulkAction,
  Config,
  Events,
  RowAction,
  Service,
  State,
} from "@zoobzio/table";

/**
 * A row action: its descriptor and its handler, under the config key.
 */
export type TableAction<T> = Bound<ActionDescriptor, RowAction<T>["action"]>;

/**
 * A bulk action over the selection: its descriptor and its handler, under
 * the config key.
 */
export type TableBulkAction = Bound<ActionDescriptor, BulkAction["action"]>;

/**
 * The slice of the state container a table may start from: the paging,
 * sort, selection, column order, and committed query the consumer chooses,
 * never what a fetch fills in. It seeds the `useState` record, so it must
 * survive Nuxt's payload (devalue carries the `Set`).
 */
export type TableInitial<T> = Partial<
  Pick<
    State<T>,
    | "page"
    | "pageSize"
    | "sortField"
    | "sortDirection"
    | "selected"
    | "columnOrder"
    | "entries"
  >
>;

/**
 * What `createTable` takes: the headless config with each action's handler
 * joined to its descriptor, the fetch mechanism, and the initial state.
 */
export type TableOptions<T> = Omit<Config<T>, "actions" | "bulkActions"> & {
  fetch: Actions<T>["fetch"];
  actions?: Record<string, TableAction<T>>;
  bulkActions?: Record<string, TableBulkAction>;
  initial?: TableInitial<T>;
};

/**
 * The Nuxt hooks a table relays: `table:updated` and `table:filtered`,
 * each carrying the service's payload with its scoping `id`.
 */
export type TableHooks = Hooks<"table", Events<unknown>>;

/**
 * The id-scoped composable `createTable` returns. Call it in setup; every
 * call yields a service over the same shared container.
 */
export type UseTable<T> = () => Service<T>;
