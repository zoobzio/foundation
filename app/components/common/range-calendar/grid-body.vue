<script lang="ts">
import type {
  RangeCalendarGridBodyContext,
  RangeCalendarGridBodyForward,
  RangeCalendarGridBodyProps,
  RangeCalendarGridBodySlots,
} from "#foundation/types/common/range-calendar/grid-body";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarGridBody, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarGridBodyProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-grid-body", RangeCalendarGridBodyForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarGridBodyContext>("range-calendar-grid-body", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarGridBodySlots>();
</script>

<template>
  <RangeCalendarGridBody ref="el" class="f-range-calendar-grid-body" v-bind="bindings">
    <slot v-bind="ctx" />
  </RangeCalendarGridBody>
</template>
