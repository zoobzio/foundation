<script lang="ts">
import type {
  DatePickerFieldContext,
  DatePickerFieldProps,
  DatePickerFieldSlots,
} from "#foundation/types/common/date-picker/field";
import type { ComponentPublicInstance } from "vue";

import { DatePickerField } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<DatePickerFieldProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const bindings = useBindings<"date-picker-field">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<DatePickerFieldContext>("date-picker-field", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerFieldSlots>();
</script>

<template>
  <DatePickerField ref="el" class="f-date-picker-field" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, segments: slotProps.segments }" />
    </template>
  </DatePickerField>
</template>
