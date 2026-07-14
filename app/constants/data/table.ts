// data/table constants

import type { InjectionKey } from "vue";

/**
 * Injection key for pre-fetched widget configs.
 * Pages provide this. Widgets inject and validate their own slice.
 */
export const WIDGET_CONFIGS: InjectionKey<Record<string, unknown>> =
  Symbol("WIDGET_CONFIGS");

// Default page size — schemas/data/table.ts
export const TABLE_DEFAULT_PAGE_SIZE = 25;

// Default filter match mode — schemas/data/table.ts
export const TABLE_DEFAULT_MATCH_MODE = "all";

// Default sort direction — schemas/data/table.ts
export const TABLE_DEFAULT_SORT_DIRECTION = "asc";

// Search input debounce (ms) — components/data/table/Search.vue
export const TABLE_SEARCH_DEBOUNCE = 300;
