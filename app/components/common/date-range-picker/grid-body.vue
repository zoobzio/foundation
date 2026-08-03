<script lang="ts">
import type {
  DateRangePickerGridBodyContext,
  DateRangePickerGridBodyForward,
  DateRangePickerGridBodyProps,
  DateRangePickerGridBodySlots,
} from "#foundation/types/common/date-range-picker/grid-body";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerGridBody, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerGridBodyProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-grid-body", DateRangePickerGridBodyForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerGridBodyContext>("date-range-picker-grid-body", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerGridBodySlots>();
</script>

<template>
  <DateRangePickerGridBody ref="el" class="f-date-range-picker-grid-body" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerGridBody>
</template>
