<script lang="ts">
import type {
  DateRangePickerContentContext,
  DateRangePickerContentForward,
  DateRangePickerContentProps,
  DateRangePickerContentSlots,
} from "../../../types/common/date-range-picker/content";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-content", DateRangePickerContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerContentContext>("date-range-picker-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerContentSlots>();
</script>

<template>
  <DateRangePickerContent ref="el" class="f-date-range-picker-content" v-bind="bindings">
    <slot v-bind="ctx" />
  </DateRangePickerContent>
</template>
