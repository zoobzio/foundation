<script lang="ts">
import type {
  RangeCalendarHeadingContext,
  RangeCalendarHeadingForward,
  RangeCalendarHeadingProps,
  RangeCalendarHeadingSlots,
} from "#foundation/types/common/range-calendar/heading";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarHeading, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarHeadingProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-heading", RangeCalendarHeadingForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarHeadingContext>("range-calendar-heading", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarHeadingSlots>();
</script>

<template>
  <RangeCalendarHeading ref="el" class="f-range-calendar-heading" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }">{{ slotProps.headingValue }}</slot>
    </template>
  </RangeCalendarHeading>
</template>
