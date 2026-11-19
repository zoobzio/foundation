import type { Bound } from "./actions";
import type { Hooks } from "./hooks";
import type {
  ActionDescriptor,
  Actions,
  BulkAction,
  Config,
  Events,
  FileAction,
  FolderAction,
  Service,
  State,
} from "@zoobzio/browser";

/**
 * A file action: its descriptor and its handler, under the config key.
 */
export type BrowserAction<T> = Bound<ActionDescriptor, FileAction<T>["action"]>;

/**
 * A folder action: its descriptor and its handler, under the config key.
 */
export type BrowserFolderAction<T = unknown> = Bound<
  ActionDescriptor,
  FolderAction<T>["action"]
>;

/**
 * A bulk action over the selected files and folders: its descriptor and
 * its handler, under the config key.
 */
export type BrowserBulkAction = Bound<ActionDescriptor, BulkAction["action"]>;

/**
 * The slice of the state container a browser may start from: the trail,
 * the file sort, the selection, and the search's clauses the consumer
 * chooses, never what a fetch fills in. It seeds the `useState` record, so it must survive Nuxt's
 * payload (devalue carries the `Set`).
 */
export type BrowserInitial<T> = Partial<
  Pick<
    State<T>,
    | "path"
    | "sortField"
    | "sortDirection"
    | "selected"
    | "selectedFolders"
    | "clauses"
  >
>;

/**
 * What `createBrowser` takes: the headless config with each action's
 * handler joined to its descriptor, the fetch mechanism, the `refresh`
 * that gives the browser its sync where there is one, and the initial
 * state.
 */
export type BrowserOptions<T> = Omit<
  Config<T>,
  "actions" | "folderActions" | "bulkActions"
> & {
  fetch: Actions<T>["fetch"];
  refresh?: Actions<T>["refresh"];
  actions?: Record<string, BrowserAction<T>>;
  folderActions?: Record<string, BrowserFolderAction<T>>;
  bulkActions?: Record<string, BrowserBulkAction>;
  initial?: BrowserInitial<T>;
};

/**
 * The Nuxt hooks a browser relays: `browser:updated`,
 * `browser:navigated`, `browser:filtered`, and `browser:restored`, each carrying the service's payload with its
 * scoping `id`.
 */
export type BrowserHooks = Hooks<"browser", Events<unknown>>;

/**
 * The id-scoped composable `createBrowser` returns. Call it in setup; every
 * call yields a service over the same shared container.
 */
export type UseBrowser<T> = () => Service<T>;
