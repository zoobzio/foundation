<script lang="ts">
import type {
  DateRangePickerCellContext,
  DateRangePickerCellForward,
  DateRangePickerCellProps,
  DateRangePickerCellSlots,
} from "#foundation/types/common/date-range-picker/cell";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerCell, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerCellProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-cell", DateRangePickerCellForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerCellContext>("date-range-picker-cell", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerCellSlots>();
</script>

<template>
  <DateRangePickerCell ref="el" class="f-date-range-picker-cell" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerCell>
</template>
