<script lang="ts">
import type {
  RangeCalendarHeadCellContext,
  RangeCalendarHeadCellForward,
  RangeCalendarHeadCellProps,
  RangeCalendarHeadCellSlots,
} from "../../../types/common/range-calendar/head-cell";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarHeadCell, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarHeadCellProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-head-cell", RangeCalendarHeadCellForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarHeadCellContext>("range-calendar-head-cell", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarHeadCellSlots>();
</script>

<template>
  <RangeCalendarHeadCell ref="el" class="f-range-calendar-head-cell" v-bind="bindings">
    <slot v-bind="ctx" />
  </RangeCalendarHeadCell>
</template>
