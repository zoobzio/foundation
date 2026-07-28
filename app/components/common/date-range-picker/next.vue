<script lang="ts">
import type {
  DateRangePickerNextContext,
  DateRangePickerNextEmits,
  DateRangePickerNextForward,
  DateRangePickerNextProps,
  DateRangePickerNextSlots,
} from "#foundation/types/common/date-range-picker/next";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerNext, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DateRangePickerNextProps>();

const emit = defineEmits<DateRangePickerNextEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-range-picker-next", DateRangePickerNextForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerNextContext>("date-range-picker-next", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DateRangePickerNextSlots>();
</script>

<template>
  <DateRangePickerNext
    ref="el"
    class="f-date-range-picker-next"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </DateRangePickerNext>
</template>
