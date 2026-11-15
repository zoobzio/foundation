import type { TableReactivityBindings } from "@tanstack/table-core/reactivity";

import {
  columnOrderingFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  functionalUpdate,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/table-core";

const SUBSCRIPTION = { unsubscribe: () => {} };

/**
 * The reactivity the engine runs on: none of its own. An atom holds no
 * cache and notifies nobody; every read is a pull, so the state container
 * is the one owner of the table's state. A plain container reads as it
 * stands, a reactive one tracks each read in whatever effect makes it, and
 * two services over one container never disagree.
 */
const reactivity: TableReactivityBindings = {
  createOptionsStore: false,
  wrapExternalAtoms: false,
  addSubscription: () => {},
  batch: (fn) => fn(),
  schedule: (fn) => queueMicrotask(fn),
  untrack: (fn) => fn(),
  createReadonlyAtom: (fn) => ({ get: fn, subscribe: () => SUBSCRIPTION }),
  createWritableAtom: <V>(initial: V) => {
    let value = initial;
    return {
      get: () => value,
      set: (next: V | ((prev: V) => V)) => {
        value = functionalUpdate(next, value);
      },
      subscribe: () => SUBSCRIPTION,
    };
  },
};

/**
 * The TanStack Table features the service registers. A feature's options,
 * state slice, and APIs exist on the table only once it is listed here.
 * The server owns filtering, sorting, and paging, so no row model beyond
 * the core one is registered.
 */
export const features = tableFeatures({
  coreReactivityFeature: reactivity,
  rowPaginationFeature,
  rowSortingFeature,
  rowSelectionFeature,
  columnOrderingFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
});

export type Features = typeof features;
