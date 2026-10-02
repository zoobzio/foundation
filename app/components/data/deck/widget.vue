<script lang="ts">
import type {
  DeckWidgetContext,
  DeckWidgetEmits,
  DeckWidgetPassthrough,
  DeckWidgetProps,
  DeckWidgetSlots,
} from "../../../types/data/deck/widget";
import type { Events } from "../../../types/data/deck";

import Feed from "./feed.vue";
import Toolbar from "./toolbar.vue";
import Fab from "../../core/fab.vue";

import { useTemplateRef } from "#imports";
import { useDeckView } from "../../../composables/deck";
import { useHooks } from "../../../composables/hook";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useForwardSlots } from "../../../composables/slots";
import { useLazyRequest } from "../../../composables/request";
import { DECK_FEED_SLOTS, DECK_TOOLBAR_SLOTS } from "../../../constants/deck";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<DeckWidgetProps<T>>();

const emit = defineEmits<DeckWidgetEmits>();

useHooks<Events>(service.id, {
  "deck:updated": (event) => emit("updated", event),
  "deck:polled": (event) => emit("polled", event),
});

const el = useTemplateRef<HTMLDivElement>("el");

const { pendingCount, hasPending, showPending } = useDeckView(service, el);

const settings = usePassthrough<DeckWidgetPassthrough>(() => ({
  pt,
  recipes: {
    pending: {
      label: `${pendingCount.value} new`,
      onClick: showPending,
    },
  },
}));

const ctx = useContext<DeckWidgetContext<T>>("data-deck", () => ({
  deck: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<DeckWidgetSlots<T>>();
const forwarded = useForwardSlots(slots, DECK_FEED_SLOTS);
const toolbarSlots = useForwardSlots(slots, DECK_TOOLBAR_SLOTS);

useLazyRequest(`init-deck-${service.id}`, () => service.init());
</script>

<template>
  <div ref="el" class="f-group f-data-deck">
    <slot name="toolbar" v-bind="ctx">
      <Toolbar :deck="service" :pt="pt?.toolbar">
        <template v-for="name in toolbarSlots" :key="name" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </Toolbar>
    </slot>

    <div class="f-group f-data-deck-body">
      <slot name="pending" v-bind="ctx">
        <Fab
          v-if="hasPending"
          v-bind="settings.pending"
          class="f-data-deck-pending"
        >
          <template v-if="slots.pendingIcon" #icon>
            <slot name="pendingIcon" v-bind="ctx" />
          </template>
        </Fab>
      </slot>

      <Feed :deck="service" :pt="pt?.feed">
        <template #card="cardProps">
          <slot name="card" v-bind="cardProps" />
        </template>
        <template v-for="name in forwarded" :key="name" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </Feed>
    </div>
  </div>
</template>
