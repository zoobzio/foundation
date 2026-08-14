<script lang="ts">
import type {
  CalendarHeaderContext,
  CalendarHeaderForward,
  CalendarHeaderProps,
  CalendarHeaderSlots,
} from "../../../types/common/calendar/header";
import type { ComponentPublicInstance } from "vue";

import { CalendarHeader, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<CalendarHeaderProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"calendar-header", CalendarHeaderForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarHeaderContext>("calendar-header", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarHeaderSlots>();
</script>

<template>
  <CalendarHeader ref="el" class="f-calendar-header" v-bind="bindings">
    <slot v-bind="ctx" />
  </CalendarHeader>
</template>
