<script lang="ts">
import type {
  RangeCalendarGridHeadContext,
  RangeCalendarGridHeadForward,
  RangeCalendarGridHeadProps,
  RangeCalendarGridHeadSlots,
} from "#foundation/types/common/range-calendar/grid-head";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarGridHead, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarGridHeadProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-grid-head", RangeCalendarGridHeadForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarGridHeadContext>("range-calendar-grid-head", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarGridHeadSlots>();
</script>

<template>
  <RangeCalendarGridHead ref="el" class="f-range-calendar-grid-head" v-bind="bindings">
    <slot v-bind="ctx" />
  </RangeCalendarGridHead>
</template>
