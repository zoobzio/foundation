<script lang="ts">
import type {
  CalendarGridBodyContext,
  CalendarGridBodyForward,
  CalendarGridBodyProps,
  CalendarGridBodySlots,
} from "#foundation/types/common/calendar/grid-body";
import type { ComponentPublicInstance } from "vue";

import { CalendarGridBody, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarGridBodyProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-grid-body", CalendarGridBodyForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarGridBodyContext>("calendar-grid-body", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarGridBodySlots>();
</script>

<template>
  <CalendarGridBody ref="el" class="f-calendar-grid-body" v-bind="bindings">
    <slot v-bind="ctx" />
  </CalendarGridBody>
</template>
