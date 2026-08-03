<script lang="ts">
import type {
  RangeCalendarHeaderContext,
  RangeCalendarHeaderForward,
  RangeCalendarHeaderProps,
  RangeCalendarHeaderSlots,
} from "#foundation/types/common/range-calendar/header";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarHeader, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarHeaderProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-header", RangeCalendarHeaderForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarHeaderContext>("range-calendar-header", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarHeaderSlots>();
</script>

<template>
  <RangeCalendarHeader ref="el" class="f-range-calendar-header" v-bind="bindings">
    <slot v-bind="ctx" />
  </RangeCalendarHeader>
</template>
