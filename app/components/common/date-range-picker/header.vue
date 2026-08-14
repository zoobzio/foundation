<script lang="ts">
import type {
  DateRangePickerHeaderContext,
  DateRangePickerHeaderForward,
  DateRangePickerHeaderProps,
  DateRangePickerHeaderSlots,
} from "../../../types/common/date-range-picker/header";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerHeader, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerHeaderProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-header", DateRangePickerHeaderForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerHeaderContext>("date-range-picker-header", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerHeaderSlots>();
</script>

<template>
  <DateRangePickerHeader ref="el" class="f-date-range-picker-header" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerHeader>
</template>
