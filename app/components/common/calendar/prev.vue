<script lang="ts">
import type {
  CalendarPrevContext,
  CalendarPrevEmits,
  CalendarPrevForward,
  CalendarPrevProps,
  CalendarPrevSlots,
} from "#foundation/types/common/calendar/prev";
import type { ComponentPublicInstance } from "vue";

import { CalendarPrev, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarPrevProps>();

const emit = defineEmits<CalendarPrevEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-prev", CalendarPrevForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarPrevContext>("calendar-prev", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarPrevSlots>();
</script>

<template>
  <CalendarPrev
    ref="el"
    class="f-calendar-prev"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </CalendarPrev>
</template>
