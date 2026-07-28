<script lang="ts">
import type {
  DatePickerGridContext,
  DatePickerGridForward,
  DatePickerGridProps,
  DatePickerGridSlots,
} from "#foundation/types/common/date-picker/grid";
import type { ComponentPublicInstance } from "vue";

import { DatePickerGrid, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerGridProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-grid", DatePickerGridForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerGridContext>("date-picker-grid", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerGridSlots>();
</script>

<template>
  <DatePickerGrid ref="el" class="f-date-picker-grid" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerGrid>
</template>
