<script lang="ts">
import type {
  RangeCalendarCellTriggerContext,
  RangeCalendarCellTriggerEmits,
  RangeCalendarCellTriggerForward,
  RangeCalendarCellTriggerProps,
  RangeCalendarCellTriggerSlots,
} from "../../../types/common/range-calendar/cell-trigger";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarCellTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarCellTriggerProps>();

const emit = defineEmits<RangeCalendarCellTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-cell-trigger", RangeCalendarCellTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarCellTriggerContext>("range-calendar-cell-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarCellTriggerSlots>();
</script>

<template>
  <RangeCalendarCellTrigger
    ref="el"
    class="f-range-calendar-cell-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }">{{ slotProps.dayValue }}</slot>
    </template>
  </RangeCalendarCellTrigger>
</template>
