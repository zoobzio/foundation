<script lang="ts">
import type {
  DatePickerCellTriggerContext,
  DatePickerCellTriggerEmits,
  DatePickerCellTriggerForward,
  DatePickerCellTriggerProps,
  DatePickerCellTriggerSlots,
} from "#foundation/types/common/date-picker/cell-trigger";
import type { ComponentPublicInstance } from "vue";

import { DatePickerCellTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerCellTriggerProps>();

const emit = defineEmits<DatePickerCellTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-cell-trigger", DatePickerCellTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerCellTriggerContext>("date-picker-cell-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerCellTriggerSlots>();
</script>

<template>
  <DatePickerCellTrigger
    ref="el"
    class="f-date-picker-cell-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }">{{ slotProps.dayValue }}</slot>
    </template>
  </DatePickerCellTrigger>
</template>
