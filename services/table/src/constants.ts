import type { StateKey, TableSlices } from "./types";

export const TABLE_DEFAULT_LOCALE = "en-US";
export const TABLE_DEFAULT_CURRENCY = "USD";
export const TABLE_DEFAULT_TIME_ZONE = "UTC";

/**
 * The slices of the TanStack table the container holds, by name.
 */
export const TABLE_SLICES: Record<keyof TableSlices, null> = {
  pagination: null,
  sorting: null,
  rowSelection: null,
  columnOrder: null,
  columnVisibility: null,
  columnSizing: null,
};

/**
 * The fields of the container, for key-driven iteration independent of a
 * container's runtime keys.
 */
export const TABLE_STATE_FIELDS: Record<StateKey, null> = {
  ...TABLE_SLICES,
  data: null,
  rowCount: null,
  loading: null,
  initialized: null,
  entries: null,
  draft: null,
  suggest: null,
};
