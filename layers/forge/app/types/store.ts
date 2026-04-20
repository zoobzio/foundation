import type { StoreGeneric } from "pinia";

/**
 * Wraps a widget state interface with Pinia's store internals.
 * Use this for component props and composable params so storeToRefs works.
 */
export type WidgetStore<T> = StoreGeneric & T;
