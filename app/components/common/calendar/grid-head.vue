<script lang="ts">
import type {
  CalendarGridHeadContext,
  CalendarGridHeadForward,
  CalendarGridHeadProps,
  CalendarGridHeadSlots,
} from "#foundation/types/common/calendar/grid-head";
import type { ComponentPublicInstance } from "vue";

import { CalendarGridHead, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarGridHeadProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-grid-head", CalendarGridHeadForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarGridHeadContext>("calendar-grid-head", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarGridHeadSlots>();
</script>

<template>
  <CalendarGridHead ref="el" class="f-calendar-grid-head" v-bind="bindings">
    <slot v-bind="ctx" />
  </CalendarGridHead>
</template>
