// data/deck constants — domain values come from the headless package; the
// view-only values (labels, slots, debounce) live here.

import type { DeckToolbarSlots } from "../types/data/deck/toolbar";

export {
  DECK_DEFAULT_MATCH_MODE,
  DECK_PAGE_SIZE,
  DECK_POLL_INTERVAL,
  DECK_SORT_LABELS as SORT_LABELS,
} from "@zoobzio/deck";

// Feed slots that share the feed ctx — relayed conditionally so the feed's
// own defaults survive. The per-item `card` slot is relayed explicitly.
export const DECK_FEED_SLOTS = ["empty", "loadingMore"] as const;

// Search input debounce (ms) — composables/deck.ts (useDeckToolbar)
export const DECK_SEARCH_DEBOUNCE = 300;

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
