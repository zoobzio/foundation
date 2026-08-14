<script lang="ts">
import type {
  DateRangePickerFieldContext,
  DateRangePickerFieldProps,
  DateRangePickerFieldSlots,
} from "../../../types/common/date-range-picker/field";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerField } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<DateRangePickerFieldProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const bindings = useBindings<"date-range-picker-field">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<DateRangePickerFieldContext>("date-range-picker-field", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerFieldSlots>();
</script>

<template>
  <DateRangePickerField ref="el" class="f-date-range-picker-field" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, segments: slotProps.segments }" />
    </template>
  </DateRangePickerField>
</template>
