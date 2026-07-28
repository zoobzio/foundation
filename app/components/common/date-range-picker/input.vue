<script lang="ts">
import type {
  DateRangePickerInputContext,
  DateRangePickerInputForward,
  DateRangePickerInputProps,
  DateRangePickerInputSlots,
} from "#foundation/types/common/date-range-picker/input";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerInput, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerInputProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-input", DateRangePickerInputForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerInputContext>("date-range-picker-input", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerInputSlots>();
</script>

<template>
  <DateRangePickerInput ref="el" class="f-date-range-picker-input" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerInput>
</template>
