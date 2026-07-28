<script lang="ts">
import type {
  DateRangePickerHeadCellContext,
  DateRangePickerHeadCellForward,
  DateRangePickerHeadCellProps,
  DateRangePickerHeadCellSlots,
} from "#foundation/types/common/date-range-picker/head-cell";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerHeadCell, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerHeadCellProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-head-cell", DateRangePickerHeadCellForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerHeadCellContext>("date-range-picker-head-cell", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerHeadCellSlots>();
</script>

<template>
  <DateRangePickerHeadCell ref="el" class="f-date-range-picker-head-cell" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerHeadCell>
</template>
