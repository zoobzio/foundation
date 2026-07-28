<script lang="ts">
import type {
  DatePickerCellContext,
  DatePickerCellForward,
  DatePickerCellProps,
  DatePickerCellSlots,
} from "#foundation/types/common/date-picker/cell";
import type { ComponentPublicInstance } from "vue";

import { DatePickerCell, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerCellProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-cell", DatePickerCellForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerCellContext>("date-picker-cell", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerCellSlots>();
</script>

<template>
  <DatePickerCell ref="el" class="f-date-picker-cell" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerCell>
</template>
