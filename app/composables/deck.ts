import type { Deck } from "#foundation/types/data/deck";
import type { FacetGroup } from "#foundation/types/core/facets";
import type { MenuGroup, MenuItem } from "#foundation/types/core/menu";
import type { ComponentPublicInstance, ShallowRef } from "vue";

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "#imports";
import { DECK_SEARCH_DEBOUNCE } from "#foundation/constants/deck";

/**
 * The feature half of the deck widget: owns the poll timer (client-only, torn
 * down on unmount) and the show-pending scroll-to-top. Timers and DOM stop
 * here — the service exposes a pure `poll()`/`showPending()`.
 */
export const useDeck = <T>(
  deck: Deck<T>,
  el: Readonly<ShallowRef<ComponentPublicInstance | null>>,
) => {
  let timer: ReturnType<typeof setInterval> | null = null;

  onMounted(() => {
    timer = setInterval(() => deck.poll(), deck.pollInterval);
  });

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });

  const showPending = () => {
    deck.showPending();
    nextTick(() => {
      const viewport = el.value?.$el?.querySelector(".f-scroll-area-viewport");
      if (viewport instanceof HTMLElement) {
        viewport.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  return { showPending };
};

/**
 * The feature half of the deck toolbar: the sort menu descriptors, the
 * debounced search that commits to the machine's query, and the facet groups
 * namespaced (`field:value`) for the Facets control.
 */
export const useDeckToolbar = <T>(deck: Deck<T>) => {
  const sortGroups = computed<MenuGroup[]>(() => [
    {
      key: "sort",
      items: deck.dateFields.map((f) => ({
        label: f.label,
        disabled: String(f.key) === deck.sortField.value,
      })),
    },
  ]);

  const onSort = (item: MenuItem) => {
    const field = deck.dateFields.find((f) => f.label === item.label);
    if (field) deck.sortField.value = String(field.key);
  };

  const searchInput = ref("");
  let debounce: ReturnType<typeof setTimeout> | null = null;

  watch(searchInput, (val) => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      deck.query.value = val;
    }, DECK_SEARCH_DEBOUNCE);
  });

  onBeforeUnmount(() => {
    if (debounce) clearTimeout(debounce);
  });

  const onSearchInput = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      searchInput.value = event.target.value;
    }
  };

  // Re-seed the input from the committed query when the search popover opens.
  const syncSearch = () => {
    searchInput.value = deck.query.value;
  };

  const facetGroups = computed<FacetGroup[]>(() =>
    deck.facetGroups.value.map((g) => ({
      ...g,
      items: g.items.map((i) => ({ ...i, value: `${g.key}:${i.value}` })),
    })),
  );

  return {
    sortGroups,
    onSort,
    searchInput,
    onSearchInput,
    syncSearch,
    facetGroups,
  };
};
