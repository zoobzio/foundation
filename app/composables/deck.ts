import type { Service } from "../types/data/deck";
import type { FacetGroup } from "../types/core/facets";
import type { MenuGroup, MenuItem } from "../types/core/menu";
import type { ComponentPublicInstance, ShallowRef } from "vue";

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "#imports";
import { useServiceRefs } from "./refs";
import { DECK_SEARCH_DEBOUNCE } from "../constants/deck";

/**
 * The view surface of the deck feature, shared by every deck component: the
 * service's state as refs, the sort menu descriptors, the debounced search,
 * and the namespaced facet options. Pass the widget's `el` to run the poll
 * timer (client-only, torn down on unmount) and the show-pending
 * scroll-to-top; children skip it. Timers and DOM stop here — the service
 * exposes a pure `poll()`/`showPending()`.
 */
export const useDeckView = <T>(
  deck: Service<T>,
  el?: Readonly<ShallowRef<ComponentPublicInstance | null>>,
) => {
  const serviceRefs = useServiceRefs(deck);

  // Shared deriveds
  const hasPending = computed(() => deck.pendingCount > 0);
  const hasQuery = computed(() => !!deck.query);

  // Poll timer + pending scroll — widget-level, keyed on `el`.
  if (el) {
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
  }

  const showPending = () => {
    deck.showPending();
    nextTick(() => {
      const viewport = el?.value?.$el?.querySelector(".f-scroll-area-viewport");
      if (viewport instanceof HTMLElement) {
        viewport.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  // Sort menu descriptors
  const sortGroups = computed<MenuGroup[]>(() => [
    {
      key: "sort",
      items: deck.dateFields.map((f) => ({
        label: f.label,
        disabled: String(f.key) === deck.sortField,
      })),
    },
  ]);

  const onSort = (item: MenuItem) => {
    const field = deck.dateFields.find((f) => f.label === item.label);
    if (field) deck.sortField = String(field.key);
  };

  // Debounced search committing to the machine's query
  const searchInput = ref("");
  let debounce: ReturnType<typeof setTimeout> | null = null;

  watch(searchInput, (val) => {
    if (debounce) clearTimeout(debounce);
    debounce = setTimeout(() => {
      deck.query = val;
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
    searchInput.value = deck.query;
  };

  // Facet groups namespaced (`field:value`) for the Facets control.
  const facetOptions = computed<FacetGroup[]>(() =>
    deck.facetGroups.map((g) => ({
      ...g,
      items: g.items.map((i) => ({ ...i, value: `${g.key}:${i.value}` })),
    })),
  );

  return {
    ...serviceRefs,
    hasPending,
    hasQuery,
    showPending,
    sortGroups,
    onSort,
    searchInput,
    onSearchInput,
    syncSearch,
    facetOptions,
  };
};
