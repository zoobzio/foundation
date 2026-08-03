<script lang="ts">
import type {
  DeckToolbarContext,
  DeckToolbarPassthrough,
  DeckToolbarProps,
  DeckToolbarSlots,
} from "#foundation/types/data/deck/toolbar";
import type { ComponentPublicInstance } from "vue";

import Button from "#foundation/components/common/button.vue";
import Facets from "#foundation/components/core/facets.vue";
import Fab from "#foundation/components/core/fab.vue";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";
import Input from "#foundation/components/common/input.vue";
import Menu from "#foundation/components/core/menu.vue";
import Popover from "#foundation/components/core/popover.vue";

import { ref, useTemplateRef, watch } from "#imports";
import { useDeck } from "#foundation/composables/deck";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import {
  DECK_REFRESH_ICON,
  DECK_SEARCH_ICON,
  DECK_SORT_CHEVRON,
} from "#foundation/constants/deck";
</script>

<script setup lang="ts" generic="T">
const { deck, pt } = defineProps<DeckToolbarProps<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

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
} = useDeck(deck);

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
    root: {},
    title: {},
    actions: {},
    sortMenu: {
      groups: sortGroups.value,
      align: "start",
      onSelect: onSort,
    },
    sortTrigger: {},
    sortChevron: { alias: DECK_SORT_CHEVRON },
    searchPopover: {
      open: searchOpen.value,
      align: "end",
      "onUpdate:open": (v) => {
        searchOpen.value = v;
      },
    },
    searchTrigger: {
      icon: DECK_SEARCH_ICON,
      badge: hasQuery.value ? "" : undefined,
    },
    search: {
      value: searchInput.value,
      placeholder: "Search...",
      onInput: onSearchInput,
      onKeydown: onSearchKeydown,
    },
    facets: {
      groups: facetOptions.value,
      selected: selectedFacets.value,
      "onUpdate:selected": (v) => {
        selectedFacets.value = v;
      },
    },
    refresh: {
      icon: DECK_REFRESH_ICON,
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
  <Group ref="el" v-bind="settings.root" class="f-data-deck-toolbar">
    <slot name="title" v-bind="ctx">
      <Group v-bind="settings.title" class="f-data-deck-title">
        <Menu v-bind="settings.sortMenu">
          <template #trigger>
            <Button v-bind="settings.sortTrigger" class="f-data-deck-title-btn">
              {{ title }}
              <Icon v-bind="settings.sortChevron" />
            </Button>
          </template>
        </Menu>
      </Group>
    </slot>

    <slot name="actions" v-bind="ctx">
      <Group v-bind="settings.actions" class="f-data-deck-actions">
        <Popover v-bind="settings.searchPopover">
          <template #trigger>
            <Fab v-bind="settings.searchTrigger" />
          </template>
          <template #content>
            <Group class="f-data-deck-search">
              <Input v-bind="settings.search" class="f-command-input" />
            </Group>
          </template>
        </Popover>

        <Facets v-bind="settings.facets" />

        <Fab v-bind="settings.refresh" />
      </Group>
    </slot>
  </Group>
</template>
