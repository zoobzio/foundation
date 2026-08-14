<script lang="ts">
import type {
  DatePickerContentContext,
  DatePickerContentForward,
  DatePickerContentProps,
  DatePickerContentSlots,
} from "../../../types/common/date-picker/content";
import type { ComponentPublicInstance } from "vue";

import { DatePickerContent, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerContentProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-content", DatePickerContentForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerContentContext>("date-picker-content", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerContentSlots>();
</script>

<template>
  <DatePickerContent ref="el" class="f-date-picker-content" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerContent>
</template>
