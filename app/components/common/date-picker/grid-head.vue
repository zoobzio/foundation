<script lang="ts">
import type {
  DatePickerGridHeadContext,
  DatePickerGridHeadForward,
  DatePickerGridHeadProps,
  DatePickerGridHeadSlots,
} from "#foundation/types/common/date-picker/grid-head";
import type { ComponentPublicInstance } from "vue";

import { DatePickerGridHead, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerGridHeadProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-grid-head", DatePickerGridHeadForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerGridHeadContext>("date-picker-grid-head", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerGridHeadSlots>();
</script>

<template>
  <DatePickerGridHead ref="el" class="f-date-picker-grid-head" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerGridHead>
</template>
