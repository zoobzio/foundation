<script lang="ts">
import type {
  RangeCalendarPrevContext,
  RangeCalendarPrevEmits,
  RangeCalendarPrevForward,
  RangeCalendarPrevProps,
  RangeCalendarPrevSlots,
} from "../../../types/common/range-calendar/prev";
import type { ComponentPublicInstance } from "vue";

import { RangeCalendarPrev, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<RangeCalendarPrevProps>();

const emit = defineEmits<RangeCalendarPrevEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"range-calendar-prev", RangeCalendarPrevForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarPrevContext>("range-calendar-prev", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarPrevSlots>();
</script>

<template>
  <RangeCalendarPrev
    ref="el"
    class="f-range-calendar-prev"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </RangeCalendarPrev>
</template>
