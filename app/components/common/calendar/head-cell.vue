<script lang="ts">
import type {
  CalendarHeadCellContext,
  CalendarHeadCellForward,
  CalendarHeadCellProps,
  CalendarHeadCellSlots,
} from "#foundation/types/common/calendar/head-cell";
import type { ComponentPublicInstance } from "vue";

import { CalendarHeadCell, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarHeadCellProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-head-cell", CalendarHeadCellForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarHeadCellContext>("calendar-head-cell", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarHeadCellSlots>();
</script>

<template>
  <CalendarHeadCell ref="el" class="f-calendar-head-cell" v-bind="bindings">
    <slot v-bind="ctx" />
  </CalendarHeadCell>
</template>
