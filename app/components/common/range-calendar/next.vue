<script lang="ts">
import type {
  RangeCalendarNextContext,
  RangeCalendarNextEmits,
  RangeCalendarNextForward,
  RangeCalendarNextProps,
  RangeCalendarNextSlots,
} from "../../../types/common/range-calendar/next";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarNext, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarNextProps>();

const emit = defineEmits<RangeCalendarNextEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-next", RangeCalendarNextForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarNextContext>("range-calendar-next", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarNextSlots>();
</script>

<template>
  <RangeCalendarNext
    ref="el"
    class="f-range-calendar-next"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </RangeCalendarNext>
</template>
