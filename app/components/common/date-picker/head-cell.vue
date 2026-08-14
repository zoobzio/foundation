<script lang="ts">
import type {
  DatePickerHeadCellContext,
  DatePickerHeadCellForward,
  DatePickerHeadCellProps,
  DatePickerHeadCellSlots,
} from "../../../types/common/date-picker/head-cell";
import type { ComponentPublicInstance } from "vue";

import { DatePickerHeadCell, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerHeadCellProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-head-cell", DatePickerHeadCellForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerHeadCellContext>("date-picker-head-cell", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerHeadCellSlots>();
</script>

<template>
  <DatePickerHeadCell ref="el" class="f-date-picker-head-cell" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerHeadCell>
</template>
