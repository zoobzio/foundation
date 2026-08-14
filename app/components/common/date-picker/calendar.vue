<script lang="ts">
import type {
  DatePickerCalendarContext,
  DatePickerCalendarProps,
  DatePickerCalendarSlots,
} from "../../../types/common/date-picker/calendar";
import type { ComponentPublicInstance } from "vue";

import { DatePickerCalendar } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<DatePickerCalendarProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const bindings = useBindings<"date-picker-calendar">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<DatePickerCalendarContext>("date-picker-calendar", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerCalendarSlots>();
</script>

<template>
  <DatePickerCalendar ref="el" class="f-date-picker-calendar" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </DatePickerCalendar>
</template>
