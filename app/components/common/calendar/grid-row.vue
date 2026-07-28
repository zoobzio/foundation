<script lang="ts">
import type {
  CalendarGridRowContext,
  CalendarGridRowForward,
  CalendarGridRowProps,
  CalendarGridRowSlots,
} from "#foundation/types/common/calendar/grid-row";
import type { ComponentPublicInstance } from "vue";

import { CalendarGridRow, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarGridRowProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-grid-row", CalendarGridRowForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarGridRowContext>("calendar-grid-row", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarGridRowSlots>();
</script>

<template>
  <CalendarGridRow ref="el" class="f-calendar-grid-row" v-bind="bindings">
    <slot v-bind="ctx" />
  </CalendarGridRow>
</template>
