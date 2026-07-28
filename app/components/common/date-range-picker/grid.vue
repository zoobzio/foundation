<script lang="ts">
import type {
  DateRangePickerGridContext,
  DateRangePickerGridForward,
  DateRangePickerGridProps,
  DateRangePickerGridSlots,
} from "#foundation/types/common/date-range-picker/grid";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerGrid, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerGridProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-grid", DateRangePickerGridForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerGridContext>("date-range-picker-grid", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerGridSlots>();
</script>

<template>
  <DateRangePickerGrid ref="el" class="f-date-range-picker-grid" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerGrid>
</template>
