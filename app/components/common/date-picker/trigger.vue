<script lang="ts">
import type {
  DatePickerTriggerContext,
  DatePickerTriggerEmits,
  DatePickerTriggerForward,
  DatePickerTriggerProps,
  DatePickerTriggerSlots,
} from "#foundation/types/common/date-picker/trigger";
import type { ComponentPublicInstance } from "vue";

import { DatePickerTrigger, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerTriggerProps>();

const emit = defineEmits<DatePickerTriggerEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-trigger", DatePickerTriggerForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerTriggerContext>("date-picker-trigger", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerTriggerSlots>();
</script>

<template>
  <DatePickerTrigger
    ref="el"
    class="f-date-picker-trigger"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </DatePickerTrigger>
</template>
