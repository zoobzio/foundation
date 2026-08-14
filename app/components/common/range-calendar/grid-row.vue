<script lang="ts">
import type {
  RangeCalendarGridRowContext,
  RangeCalendarGridRowForward,
  RangeCalendarGridRowProps,
  RangeCalendarGridRowSlots,
} from "../../../types/common/range-calendar/grid-row";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarGridRow, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarGridRowProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-grid-row", RangeCalendarGridRowForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarGridRowContext>("range-calendar-grid-row", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarGridRowSlots>();
</script>

<template>
  <RangeCalendarGridRow ref="el" class="f-range-calendar-grid-row" v-bind="bindings">
    <slot v-bind="ctx" />
  </RangeCalendarGridRow>
</template>
