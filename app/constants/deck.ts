// data/deck constants

import type { MatchMode } from "../types/data/deck";
import type { DeckToolbarSlots } from "../types/data/deck/toolbar";

// Feed slots that share the feed ctx — relayed conditionally so the feed's
// own defaults survive. The per-item `card` slot is relayed explicitly.
export const DECK_FEED_SLOTS = ["empty", "loadingMore"] as const;

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

// Search input debounce (ms) — composables/deck.ts (useDeckToolbar)
export const DECK_SEARCH_DEBOUNCE = 300;

// Default filter match mode
export const DECK_DEFAULT_MATCH_MODE: MatchMode = "all";

// Toolbar fab labels
export const DECK_SEARCH_LABEL = "Search";
export const DECK_REFRESH_LABEL = "Refresh";

// Toolbar icon slots the widget relays — all share the toolbar ctx.
export const DECK_TOOLBAR_SLOTS = [
  "sortIcon",
  "searchIcon",
  "facetsIcon",
  "refreshIcon",
] as const satisfies readonly (keyof DeckToolbarSlots<unknown>)[];
