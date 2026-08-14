<script lang="ts">
import type {
  DatePickerHeadingContext,
  DatePickerHeadingForward,
  DatePickerHeadingProps,
  DatePickerHeadingSlots,
} from "../../../types/common/date-picker/heading";
import type { ComponentPublicInstance } from "vue";

import { DatePickerHeading, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerHeadingProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-heading", DatePickerHeadingForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerHeadingContext>("date-picker-heading", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerHeadingSlots>();
</script>

<template>
  <DatePickerHeading ref="el" class="f-date-picker-heading" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }">{{ slotProps.headingValue }}</slot>
    </template>
  </DatePickerHeading>
</template>
