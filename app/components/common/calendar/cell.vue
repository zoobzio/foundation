<script lang="ts">
import type {
  CalendarCellContext,
  CalendarCellForward,
  CalendarCellProps,
  CalendarCellSlots,
} from "#foundation/types/common/calendar/cell";
import type { ComponentPublicInstance } from "vue";

import { CalendarCell, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarCellProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-cell", CalendarCellForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarCellContext>("calendar-cell", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarCellSlots>();
</script>

<template>
  <CalendarCell ref="el" class="f-calendar-cell" v-bind="bindings">
    <slot v-bind="ctx" />
  </CalendarCell>
</template>
