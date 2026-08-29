<script lang="ts">
import type {
  DeckFeedContext,
  DeckFeedPassthrough,
  DeckFeedProps,
  DeckFeedSlots,
} from "../../../types/data/deck/feed";
import type { ComponentPublicInstance } from "vue";

import Scroller from "../../core/scroller.vue";

import { useTemplateRef } from "#imports";
import { useDeckView } from "../../../composables/deck";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts" generic="T">
const { deck, pt } = defineProps<DeckFeedProps<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const { items, loadingMore } = useDeckView(deck);

const settings = usePassthrough<DeckFeedPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
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
      <div class="f-group f-data-deck-empty">No items</div>
    </slot>

    <template v-else>
      <div
        v-for="(item, index) in items"
        :key="String(item[deck.rowKey])"
        class="f-group f-data-deck-card"
      >
        <slot name="card" v-bind="{ item, index, deck }" />
      </div>

      <!-- Infinite-scroll sentinel — surfaces loadingMore; loadMore is driven
           imperatively (deck.loadMore) until an observer is wired. -->
      <div class="f-group f-data-deck-sentinel">
        <slot v-if="loadingMore" name="loadingMore" v-bind="ctx" />
      </div>
    </template>
  </Scroller>
</template>
