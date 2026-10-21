/**
 * The browser domain contract lives in the headless `@zoobzio/browser`
 * package. Re-exported here so layer modules and consumers keep one import
 * path. The browser carries its own column and action shapes — structurally
 * like the table's, with no dependency between the packages.
 */
export type {
  ActionDescriptor,
  Actions,
  BrowserColumn,
  BrowserCrumb,
  BrowserFetchParams,
  BrowserFetchResult,
  BrowserFolder,
  BulkAction,
  Change,
  Changes,
  ColumnType,
  Config,
  Event,
  FileAction,
  FolderAction,
  Listener,
  Middleware,
  Options,
  Service,
  SortDirection,
  State,
  StateKey,
} from "@zoobzio/browser";

export type { Events as ServiceEvents } from "@zoobzio/browser";

/**
 * The Nuxt hook map of a browser: the service's domain events, prefixed and
 * id-scoped, as `useBrowser` relays them onto the app hook bus.
 */
export type Events = {
  "browser:updated": (event: {
    id: string;
    path: string[];
    folders: number;
    files: number;
  }) => void;
  "browser:navigated": (event: { id: string; path: string[] }) => void;
};
