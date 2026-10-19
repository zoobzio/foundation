import type { TableFilter } from "@zoobzio/table";

/**
 * The table domain contract lives in the headless `@zoobzio/table` package.
 * Re-exported here so layer modules and consumers keep one import path.
 */
export type {
  ActionDescriptor,
  Actions,
  BulkAction,
  Change,
  Changes,
  ColumnType,
  Config,
  DataTableColumn,
  DataTableFetchParams,
  DataTableFetchResult,
  Event,
  Listener,
  Middleware,
  Options,
  RowAction,
  Service,
  SortDirection,
  State,
  StateKey,
  TableFilter,
} from "@zoobzio/table";

export type { Events as ServiceEvents } from "@zoobzio/table";

/**
 * The Nuxt hook map of a table: the service's domain events, prefixed and
 * id-scoped, as `useTable` relays them onto the app hook bus.
 */
export type Events = {
  "table:updated": (event: { id: string; total: number }) => void;
  "table:filtered": (event: {
    id: string;
    query: string;
    filters: TableFilter[];
  }) => void;
};
