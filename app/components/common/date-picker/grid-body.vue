<script lang="ts">
import type {
  DatePickerGridBodyContext,
  DatePickerGridBodyForward,
  DatePickerGridBodyProps,
  DatePickerGridBodySlots,
} from "../../../types/common/date-picker/grid-body";
import type { ComponentPublicInstance } from "vue";

import { DatePickerGridBody, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria, ...rest } = defineProps<DatePickerGridBodyProps>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-grid-body", DatePickerGridBodyForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerGridBodyContext>("date-picker-grid-body", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerGridBodySlots>();
</script>

<template>
  <DatePickerGridBody ref="el" class="f-date-picker-grid-body" v-bind="bindings">
    <slot v-bind="ctx" />
  </DatePickerGridBody>
</template>
