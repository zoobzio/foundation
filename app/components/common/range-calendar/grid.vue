<script lang="ts">
import type {
  RangeCalendarGridContext,
  RangeCalendarGridForward,
  RangeCalendarGridProps,
  RangeCalendarGridSlots,
} from "#foundation/types/common/range-calendar/grid";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarGrid, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarGridProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-grid", RangeCalendarGridForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarGridContext>("range-calendar-grid", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarGridSlots>();
</script>

<template>
  <RangeCalendarGrid ref="el" class="f-range-calendar-grid" v-bind="bindings">
    <slot v-bind="ctx" />
  </RangeCalendarGrid>
</template>
