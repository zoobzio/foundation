<script lang="ts">
import type { DataDeckToolbarProps } from "#foundation/types/data/toolbar";
</script>

<script setup lang="ts" generic="T">
import { computed, ref, useTemplateRef, watch } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { DECK_SEARCH_DEBOUNCE } from "#foundation/constants/data/deck";
import Button from "#foundation/components/common/Button.vue";
import Command from "#foundation/components/core/Command.vue";
import Fab from "#foundation/components/core/Fab.vue";
import Facets from "#foundation/components/data/filter/Facets.vue";
import Group from "#foundation/components/common/Group.vue";
import Icon from "#foundation/components/common/Icon.vue";
import Input from "#foundation/components/common/Input.vue";
import Popover from "#foundation/components/core/Popover.vue";
const { deck, pt } = defineProps<DataDeckToolbarProps<T>>();

const el = useTemplateRef("el");
defineExpose({ el });

// Sort field selector
const sortOpen = ref(false);

const sortGroups = computed(() => [{
  key: "dateFields",
  items: deck.dateFields.map((f) => ({
    value: String(f.key),
    label: f.label,
    disabled: String(f.key) === deck.sortField.value,
  })),
}]);

// Destructure reactive refs from deck to avoid prop mutation lint errors
const { selectedFacets, query, facetGroups } = deck;

// Search
const searchOpen = ref(false);
const searchInput = ref("");
const searchDebounce = ref<ReturnType<typeof setTimeout> | null>(null);

watch(searchOpen, (v) => {
  if (v) searchInput.value = query.value;
});

watch(searchInput, (val) => {
  if (searchDebounce.value) clearTimeout(searchDebounce.value);
  searchDebounce.value = setTimeout(() => {
    query.value = val;
    deck.fetch();
  }, DECK_SEARCH_DEBOUNCE);
});

const hasQuery = computed(() => !!query.value);

// Facets — namespace values as "field:value" for the Facets component
const namespacedFacetGroups = computed(() =>
  facetGroups.value.map((g) => ({
    ...g,
    items: g.items.map((item) => ({
      ...item,
      value: `${g.key}:${item.value}`,
    })),
  })),
);

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const titlePT = usePassthrough(pt?.title, { props: {}, handlers: {} });
const actionsPT = usePassthrough(pt?.actions, { props: {}, handlers: {} });
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-deck-toolbar"
    v-on="rootPT.handlers"
  >
    <!-- Title — sort field selector -->
    <Group
      v-bind="titlePT.props"
      class="f-data-deck-title"
      v-on="titlePT.handlers"
    >
      <Popover
        :open="sortOpen"
        align="start"
        @update:open="sortOpen = $event"
      >
        <template #trigger>
          <Button class="f-data-deck-title-btn">
            {{ deck.title.value }}
            <Icon alias="chevron-down" />
          </Button>
        </template>
        <template #content>
          <Command
            :groups="sortGroups"
            @select="deck.setSortField($event); sortOpen = false"
            @keydown.escape="sortOpen = false"
          />
        </template>
      </Popover>
    </Group>

    <!-- Actions — fabs -->
    <Group
      v-bind="actionsPT.props"
      class="f-data-deck-actions"
      v-on="actionsPT.handlers"
    >
      <!-- Search -->
      <Popover
        :open="searchOpen"
        align="end"
        @update:open="searchOpen = $event"
      >
        <template #trigger>
          <Fab icon="search" :badge="hasQuery ? '' : undefined" />
        </template>
        <template #content>
          <Group class="f-data-deck-search">
            <Input
              :value="searchInput"
              class="f-command-input"
              placeholder="Search..."
              @input="searchInput = ($event.target as HTMLInputElement).value"
              @keydown.escape="searchOpen = false"
            />
          </Group>
        </template>
      </Popover>

      <!-- Facets -->
      <Facets
        v-model:selected="selectedFacets"
        :groups="namespacedFacetGroups"
      />

      <!-- Refresh -->
      <Fab icon="refresh" @click="deck.fetch()" />
    </Group>
  </Group>
</template>
