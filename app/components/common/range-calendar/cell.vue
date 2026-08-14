<script lang="ts">
import type {
  RangeCalendarCellContext,
  RangeCalendarCellForward,
  RangeCalendarCellProps,
  RangeCalendarCellSlots,
} from "../../../types/common/range-calendar/cell";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarCell, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarCellProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-cell", RangeCalendarCellForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarCellContext>("range-calendar-cell", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarCellSlots>();
</script>

<template>
  <RangeCalendarCell ref="el" class="f-range-calendar-cell" v-bind="bindings">
    <slot v-bind="ctx" />
  </RangeCalendarCell>
</template>
