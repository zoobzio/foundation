<script lang="ts">
import type {
  DatePickerGridRowContext,
  DatePickerGridRowForward,
  DatePickerGridRowProps,
  DatePickerGridRowSlots,
} from "../../../types/common/date-picker/grid-row";
import type { ComponentPublicInstance } from "vue";

import { DatePickerGridRow, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerGridRowProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-grid-row", DatePickerGridRowForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerGridRowContext>("date-picker-grid-row", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerGridRowSlots>();
</script>

<template>
  <DatePickerGridRow ref="el" class="f-date-picker-grid-row" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerGridRow>
</template>
