<script lang="ts">
import type { DataDeckProps } from "../../../types/data-deck-widget";
</script>

<script setup lang="ts" generic="T">
const { deck, pt } = defineProps<DataDeckProps<T>>();

useLazyAsyncData(`init-deck-${useId()}`, deck.init, { server: false });

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ deck }));

const hasPending = computed(() => deck.pendingCount.value > 0);

const handlePendingClick = () => {
  deck.showPending();
  const viewport = el.value?.$el?.querySelector(".f-scroller-viewport") as HTMLElement | null;
  viewport?.scrollTo({ top: 0, behavior: "smooth" });
};

// Start polling on mount, stop on unmount
onMounted(() => {
  deck.startPolling();
  onBeforeUnmount(() => deck.stopPolling());
});

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const pendingButtonPT = usePassthrough(pt?.pendingButton, () => ({
  props: {
    icon: "add" as IconAlias,
    label: `${deck.pendingCount.value} new`,
  },
  handlers: {},
}));
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-deck"
    v-on="rootPT.handlers"
  >
    <slot name="toolbar" v-bind="ctx">
      <DataDeckToolbar :deck="deck" :pt="pt?.toolbar" />
    </slot>

    <Group class="f-data-deck-body">
      <slot name="pending" v-bind="ctx">
        <Fab
          v-if="hasPending"
          v-bind="pendingButtonPT.props"
          class="f-data-deck-pending"
          v-on="pendingButtonPT.handlers"
          @click="handlePendingClick"
        />
      </slot>

      <DataDeckFeed
        :deck="deck"
        :pt="pt?.feed"
      >
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </DataDeckFeed>
    </Group>
  </Group>
</template>
