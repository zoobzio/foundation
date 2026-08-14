import type { AutocompleteItemSlots } from "../types/data/autocomplete/item";

// Delay before clearing focus on blur, so a suggestion click can register first.
export const AUTOCOMPLETE_BLUR_DELAY_MS = 150;

/**
 * The item-level slot names the autocomplete widget relays to each item.
 */
export const AUTOCOMPLETE_ITEM_SLOTS: (keyof AutocompleteItemSlots<unknown>)[] =
  ["icon", "label", "arrow"];
