<script lang="ts">
import type {
  DeckFeedContext,
  DeckFeedPassthrough,
  DeckFeedProps,
  DeckFeedSlots,
} from "../../../types/data/deck/feed";
import type { ComponentPublicInstance } from "vue";

import Group from "../../common/group.vue";
import Scroller from "../../core/scroller.vue";

import { useTemplateRef } from "#imports";
import { useDeck } from "../../../composables/deck";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts" generic="T">
const { deck, pt } = defineProps<DeckFeedProps<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const { items, loadingMore } = useDeck(deck);

const settings = usePassthrough<DeckFeedPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    card: {},
    sentinel: {},
  },
}));

const ctx = useContext<DeckFeedContext<T>>("data-deck-feed", () => ({
  deck,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<DeckFeedSlots<T>>();
</script>

<template>
  <Scroller ref="el" v-bind="settings.root" class="f-data-deck-feed">
    <slot v-if="!items.length" name="empty" v-bind="ctx">
      <Group class="f-data-deck-empty">No items</Group>
    </slot>

    <template v-else>
      <Group
        v-for="(item, index) in items"
        :key="String(item[deck.rowKey])"
        v-bind="settings.card"
        class="f-data-deck-card"
      >
        <slot name="card" v-bind="{ item, index, deck }" />
      </Group>

      <!-- Infinite-scroll sentinel — surfaces loadingMore; loadMore is driven
           imperatively (deck.loadMore) until an observer is wired. -->
      <Group v-bind="settings.sentinel" class="f-data-deck-sentinel">
        <slot v-if="loadingMore" name="loadingMore" v-bind="ctx" />
      </Group>
    </template>
  </Scroller>
</template>
