<script lang="ts">
import type {
  CalendarGridContext,
  CalendarGridForward,
  CalendarGridProps,
  CalendarGridSlots,
} from "../../../types/common/calendar/grid";
import type { ComponentPublicInstance } from "vue";

import { CalendarGrid, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarGridProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-grid", CalendarGridForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarGridContext>("calendar-grid", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarGridSlots>();
</script>

<template>
  <CalendarGrid ref="el" class="f-calendar-grid" v-bind="bindings">
    <slot v-bind="ctx" />
  </CalendarGrid>
</template>
