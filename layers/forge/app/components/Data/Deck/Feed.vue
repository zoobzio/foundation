<script lang="ts">
import type { DataDeckFeedProps } from "../../../types/data-deck-feed";
</script>

<script setup lang="ts" generic="T">
const { deck, pt } = defineProps<DataDeckFeedProps<T>>();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ deck }));

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const cardPT = usePassthrough(pt?.card, { props: {}, handlers: {} });
const sentinelPT = usePassthrough(pt?.sentinel, { props: {}, handlers: {} });
</script>

<template>
  <Scroller
    ref="el"
    v-bind="rootPT.props"
    class="f-data-deck-feed"
    v-on="rootPT.handlers"
  >
    <template #content>
      <slot v-if="!deck.items.value.length" name="empty" v-bind="ctx">
        <Group class="f-data-deck-empty">No items</Group>
      </slot>

      <template v-else>
        <Group
          v-for="(item, index) in deck.items.value"
          :key="String(item[deck.rowKey])"
          v-bind="cardPT.props"
          class="f-data-deck-card"
          v-on="cardPT.handlers"
        >
          <slot name="card" v-bind="{ item, deck, index }" />
        </Group>

        <!-- Infinite scroll sentinel -->
        <Group
          v-bind="sentinelPT.props"
          class="f-data-deck-sentinel"
          v-on="sentinelPT.handlers"
        >
          <slot v-if="deck.loadingMore.value" name="loadingMore" v-bind="ctx" />
        </Group>
      </template>
    </template>
  </Scroller>
</template>
