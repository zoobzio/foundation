<script lang="ts">
import type {
  DateRangePickerGridHeadContext,
  DateRangePickerGridHeadForward,
  DateRangePickerGridHeadProps,
  DateRangePickerGridHeadSlots,
} from "#foundation/types/common/date-range-picker/grid-head";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerGridHead, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerGridHeadProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-grid-head", DateRangePickerGridHeadForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerGridHeadContext>("date-range-picker-grid-head", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerGridHeadSlots>();
</script>

<template>
  <DateRangePickerGridHead ref="el" class="f-date-range-picker-grid-head" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerGridHead>
</template>
