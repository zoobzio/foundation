<script lang="ts">
import type {
  DateRangePickerHeadingContext,
  DateRangePickerHeadingForward,
  DateRangePickerHeadingProps,
  DateRangePickerHeadingSlots,
} from "#foundation/types/common/date-range-picker/heading";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerHeading, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerHeadingProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-heading", DateRangePickerHeadingForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerHeadingContext>("date-range-picker-heading", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerHeadingSlots>();
</script>

<template>
  <DateRangePickerHeading ref="el" class="f-date-range-picker-heading" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }">{{ slotProps.headingValue }}</slot>
    </template>
  </DateRangePickerHeading>
</template>
