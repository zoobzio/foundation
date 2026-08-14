<script lang="ts">
import type {
  DatePickerInputContext,
  DatePickerInputForward,
  DatePickerInputProps,
  DatePickerInputSlots,
} from "../../../types/common/date-picker/input";
import type { ComponentPublicInstance } from "vue";

import { DatePickerInput, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerInputProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-input", DatePickerInputForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerInputContext>("date-picker-input", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerInputSlots>();
</script>

<template>
  <DatePickerInput ref="el" class="f-date-picker-input" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerInput>
</template>
