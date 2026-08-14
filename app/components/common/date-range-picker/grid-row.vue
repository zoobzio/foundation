<script lang="ts">
import type {
  DateRangePickerGridRowContext,
  DateRangePickerGridRowForward,
  DateRangePickerGridRowProps,
  DateRangePickerGridRowSlots,
} from "../../../types/common/date-range-picker/grid-row";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerGridRow, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerGridRowProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-grid-row", DateRangePickerGridRowForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerGridRowContext>("date-range-picker-grid-row", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerGridRowSlots>();
</script>

<template>
  <DateRangePickerGridRow ref="el" class="f-date-range-picker-grid-row" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerGridRow>
</template>
