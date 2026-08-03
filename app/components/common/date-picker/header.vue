<script lang="ts">
import type {
  DatePickerHeaderContext,
  DatePickerHeaderForward,
  DatePickerHeaderProps,
  DatePickerHeaderSlots,
} from "#foundation/types/common/date-picker/header";
import type { ComponentPublicInstance } from "vue";

import { DatePickerHeader, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerHeaderProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-header", DatePickerHeaderForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerHeaderContext>("date-picker-header", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerHeaderSlots>();
</script>

<template>
  <DatePickerHeader ref="el" class="f-date-picker-header" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerHeader>
</template>
