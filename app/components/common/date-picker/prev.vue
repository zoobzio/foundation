<script lang="ts">
import type {
  DatePickerPrevContext,
  DatePickerPrevEmits,
  DatePickerPrevForward,
  DatePickerPrevProps,
  DatePickerPrevSlots,
} from "#foundation/types/common/date-picker/prev";
import type { ComponentPublicInstance } from "vue";

import { DatePickerPrev, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerPrevProps>();

const emit = defineEmits<DatePickerPrevEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-prev", DatePickerPrevForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerPrevContext>("date-picker-prev", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerPrevSlots>();
</script>

<template>
  <DatePickerPrev
    ref="el"
    class="f-date-picker-prev"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </DatePickerPrev>
</template>
