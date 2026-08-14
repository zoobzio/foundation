<script lang="ts">
import type {
  DateRangePickerCalendarContext,
  DateRangePickerCalendarProps,
  DateRangePickerCalendarSlots,
} from "../../../types/common/date-range-picker/calendar";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerCalendar } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<DateRangePickerCalendarProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const bindings = useBindings<"date-range-picker-calendar">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<DateRangePickerCalendarContext>("date-range-picker-calendar", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerCalendarSlots>();
</script>

<template>
  <DateRangePickerCalendar ref="el" class="f-date-range-picker-calendar" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </DateRangePickerCalendar>
</template>
