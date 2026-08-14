<script lang="ts">
import type {
  DateRangePickerPrevContext,
  DateRangePickerPrevEmits,
  DateRangePickerPrevForward,
  DateRangePickerPrevProps,
  DateRangePickerPrevSlots,
} from "../../../types/common/date-range-picker/prev";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerPrev, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerPrevProps>();

const emit = defineEmits<DateRangePickerPrevEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-prev", DateRangePickerPrevForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerPrevContext>("date-range-picker-prev", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerPrevSlots>();
</script>

<template>
  <DateRangePickerPrev
    ref="el"
    class="f-date-range-picker-prev"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </DateRangePickerPrev>
</template>
