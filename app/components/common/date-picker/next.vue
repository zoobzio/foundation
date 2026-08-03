<script lang="ts">
import type {
  DatePickerNextContext,
  DatePickerNextEmits,
  DatePickerNextForward,
  DatePickerNextProps,
  DatePickerNextSlots,
} from "#foundation/types/common/date-picker/next";
import type { ComponentPublicInstance } from "vue";

import { DatePickerNext, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerNextProps>();

const emit = defineEmits<DatePickerNextEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-next", DatePickerNextForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerNextContext>("date-picker-next", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerNextSlots>();
</script>

<template>
  <DatePickerNext
    ref="el"
    class="f-date-picker-next"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps }" />
    </template>
  </DatePickerNext>
</template>
