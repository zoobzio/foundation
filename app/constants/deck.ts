// data/deck constants

export const SORT_LABELS: Record<string, string> = {
  created: "Created",
  updated: "Updated",
  published: "Published",
  modified: "Modified",
};

// Default polling interval for newer items (ms)
export const DECK_POLL_INTERVAL = 30000;

// Default page size for fetch requests
export const DECK_PAGE_SIZE = 25;

// Search input debounce (ms) — components/data/deck/Toolbar.vue
export const DECK_SEARCH_DEBOUNCE = 300;

// Default filter match mode — schemas/data/deck.ts
export const DECK_DEFAULT_MATCH_MODE = "all";
