<script lang="ts">
import type {
  DeckToolbarContext,
  DeckToolbarPassthrough,
  DeckToolbarProps,
  DeckToolbarSlots,
} from "../../../types/data/deck/toolbar";

import Facets from "../../core/facets.vue";
import Fab from "../../core/fab.vue";
import Menu from "../../core/menu.vue";
import Popover from "../../core/popover.vue";

import { ref, useTemplateRef, watch } from "#imports";
import { useDeckView } from "../../../composables/deck";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { DECK_REFRESH_LABEL, DECK_SEARCH_LABEL } from "../../../constants/deck";
</script>

<script setup lang="ts" generic="T">
const { deck, pt } = defineProps<DeckToolbarProps<T>>();

const el = useTemplateRef<HTMLDivElement>("el");

const {
  title,
  selectedFacets,
  hasQuery,
  sortGroups,
  onSort,
  searchInput,
  onSearchInput,
  syncSearch,
  facetOptions,
} = useDeckView(deck);

const searchOpen = ref(false);
watch(searchOpen, (open) => {
  if (open) syncSearch();
});

const onSearchKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") searchOpen.value = false;
};

const settings = usePassthrough<DeckToolbarPassthrough>(() => ({
  pt,
  recipes: {
    sortMenu: {
      groups: sortGroups.value,
      align: "start",
      onSelect: onSort,
    },
    searchPopover: {
      open: searchOpen.value,
      align: "end",
      "onUpdate:open": (v) => {
        searchOpen.value = v;
      },
    },
    searchTrigger: {
      label: DECK_SEARCH_LABEL,
      badge: hasQuery.value ? "" : undefined,
    },
    facets: {
      groups: facetOptions.value,
      selected: selectedFacets.value,
      "onUpdate:selected": (v) => {
        selectedFacets.value = v;
      },
    },
    refresh: {
      label: DECK_REFRESH_LABEL,
      onClick: () => deck.fetch(),
    },
  },
}));

const ctx = useContext<DeckToolbarContext<T>>("data-deck-toolbar", () => ({
  deck,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<DeckToolbarSlots<T>>();
</script>

<template>
  <div ref="el" class="f-group f-data-deck-toolbar">
    <slot name="title" v-bind="ctx">
      <div class="f-group f-data-deck-title">
        <Menu v-bind="settings.sortMenu">
          <template #trigger>
            <button type="button" class="f-button f-data-deck-title-btn">
              {{ title }}
              <slot name="sortIcon" v-bind="ctx" />
            </button>
          </template>
        </Menu>
      </div>
    </slot>

    <slot name="actions" v-bind="ctx">
      <div class="f-group f-data-deck-actions">
        <Popover v-bind="settings.searchPopover">
          <template #trigger>
            <Fab v-bind="settings.searchTrigger">
              <template v-if="$slots.searchIcon" #icon>
                <slot name="searchIcon" v-bind="ctx" />
              </template>
            </Fab>
          </template>
          <template #content>
            <div class="f-group f-data-deck-search">
              <input
                class="f-input f-command-input"
                :value="searchInput"
                placeholder="Search..."
                @input="onSearchInput"
                @keydown="onSearchKeydown"
              />
            </div>
          </template>
        </Popover>

        <Facets v-bind="settings.facets">
          <template v-if="$slots.facetsIcon" #triggerIcon>
            <slot name="facetsIcon" v-bind="ctx" />
          </template>
        </Facets>

        <Fab v-bind="settings.refresh">
          <template v-if="$slots.refreshIcon" #icon>
            <slot name="refreshIcon" v-bind="ctx" />
          </template>
        </Fab>
      </div>
    </slot>
  </div>
</template>
