<script lang="ts">
import type {
  DeckWidgetContext,
  DeckWidgetEmits,
  DeckWidgetPassthrough,
  DeckWidgetProps,
  DeckWidgetSlots,
} from "../../../types/data/deck/widget";
import type { Events } from "../../../types/data/deck";
import type { ComponentPublicInstance } from "vue";

import Feed from "./feed.vue";
import Toolbar from "./toolbar.vue";
import Fab from "../../core/fab.vue";
import Group from "../../common/group.vue";

import { useTemplateRef } from "#imports";
import { useDeck } from "../../../composables/deck";
import { useHooks } from "../../../composables/hook";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useForwardSlots } from "../../../composables/slots";
import { useLazyRequest } from "../../../composables/request";
import { DECK_FEED_SLOTS, DECK_PENDING_ICON } from "../../../constants/deck";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<DeckWidgetProps<T>>();

const emit = defineEmits<DeckWidgetEmits>();

useHooks<Events>(service.id, {
  "deck:updated": (event) => emit("updated", event),
  "deck:polled": (event) => emit("polled", event),
});

const el = useTemplateRef<ComponentPublicInstance>("el");

const { pendingCount, hasPending, showPending } = useDeck(service, el);

const settings = usePassthrough<DeckWidgetPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    body: {},
    pending: {
      icon: DECK_PENDING_ICON,
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

useLazyRequest(`init-deck-${service.id}`, () => service.init());
</script>

<template>
  <Group ref="el" v-bind="settings.root" class="f-data-deck">
    <slot name="toolbar" v-bind="ctx">
      <Toolbar :deck="service" :pt="pt?.toolbar" />
    </slot>

    <Group v-bind="settings.body" class="f-data-deck-body">
      <slot name="pending" v-bind="ctx">
        <Fab
          v-if="hasPending"
          v-bind="settings.pending"
          class="f-data-deck-pending"
        />
      </slot>

      <Feed :deck="service" :pt="pt?.feed">
        <template #card="cardProps">
          <slot name="card" v-bind="cardProps" />
        </template>
        <template v-for="name in forwarded" :key="name" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </Feed>
    </Group>
  </Group>
</template>
