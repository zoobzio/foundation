<script lang="ts">
import type {
  DateRangePickerCellTriggerContext,
  DateRangePickerCellTriggerEmits,
  DateRangePickerCellTriggerForward,
  DateRangePickerCellTriggerProps,
  DateRangePickerCellTriggerSlots,
} from "#foundation/types/common/date-range-picker/cell-trigger";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerCellTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerCellTriggerProps>();

const emit = defineEmits<DateRangePickerCellTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-cell-trigger", DateRangePickerCellTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerCellTriggerContext>("date-range-picker-cell-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerCellTriggerSlots>();
</script>

<template>
  <DateRangePickerCellTrigger
    ref="el"
    class="f-date-range-picker-cell-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }">{{ slotProps.dayValue }}</slot>
    </template>
  </DateRangePickerCellTrigger>
</template>
