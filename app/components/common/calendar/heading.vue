<script lang="ts">
import type {
  CalendarHeadingContext,
  CalendarHeadingForward,
  CalendarHeadingProps,
  CalendarHeadingSlots,
} from "#foundation/types/common/calendar/heading";
import type { ComponentPublicInstance } from "vue";

import { CalendarHeading, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarHeadingProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-heading", CalendarHeadingForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarHeadingContext>("calendar-heading", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarHeadingSlots>();
</script>

<template>
  <CalendarHeading ref="el" class="f-calendar-heading" v-bind="bindings">
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }">{{ slotProps.headingValue }}</slot>
    </template>
  </CalendarHeading>
</template>
