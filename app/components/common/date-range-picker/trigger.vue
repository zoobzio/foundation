<script lang="ts">
import type {
  DateRangePickerTriggerContext,
  DateRangePickerTriggerEmits,
  DateRangePickerTriggerForward,
  DateRangePickerTriggerProps,
  DateRangePickerTriggerSlots,
} from "#foundation/types/common/date-range-picker/trigger";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerTriggerProps>();

const emit = defineEmits<DateRangePickerTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-trigger", DateRangePickerTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerTriggerContext>("date-range-picker-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerTriggerSlots>();
</script>

<template>
  <DateRangePickerTrigger
    ref="el"
    class="f-date-range-picker-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </DateRangePickerTrigger>
</template>
