<script lang="ts">
import type {
  CalendarCellTriggerContext,
  CalendarCellTriggerEmits,
  CalendarCellTriggerForward,
  CalendarCellTriggerProps,
  CalendarCellTriggerSlots,
} from "../../../types/common/calendar/cell-trigger";
import type { ComponentPublicInstance } from "vue";

import { CalendarCellTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarCellTriggerProps>();

const emit = defineEmits<CalendarCellTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-cell-trigger", CalendarCellTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarCellTriggerContext>("calendar-cell-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarCellTriggerSlots>();
</script>

<template>
  <CalendarCellTrigger
    ref="el"
    class="f-calendar-cell-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }">{{ slotProps.dayValue }}</slot>
    </template>
  </CalendarCellTrigger>
</template>
