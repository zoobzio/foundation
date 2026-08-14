<script lang="ts">
import type {
  CalendarNextContext,
  CalendarNextEmits,
  CalendarNextForward,
  CalendarNextProps,
  CalendarNextSlots,
} from "../../../types/common/calendar/next";
import type { ComponentPublicInstance } from "vue";

import { CalendarNext, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarNextProps>();

const emit = defineEmits<CalendarNextEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-next", CalendarNextForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarNextContext>("calendar-next", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarNextSlots>();
</script>

<template>
  <CalendarNext
    ref="el"
    class="f-calendar-next"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </CalendarNext>
</template>
