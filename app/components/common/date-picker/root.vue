<script lang="ts">
import type {
  DatePickerRootContext,
  DatePickerRootEmits,
  DatePickerRootForward,
  DatePickerRootProps,
  DatePickerRootSlots,
} from "../../../types/common/date-picker/root";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance } from "vue";

import { DatePickerRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useModel } from "../../../composables/model";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const {
  modelValue,
  open = undefined,
  defaultOpen = false,
  modifiers,
  tokens,
  aria,
  ...rest
} = defineProps<DatePickerRootProps>();

const emit = defineEmits<DatePickerRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateValue | undefined>(
  () => modelValue ?? undefined,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: defaultOpen },
);

const forward = useForwardProps(rest);

const bindings = useBindings<"date-picker-root", DatePickerRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DatePickerRootContext>("date-picker-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  open: $open,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<DatePickerRootSlots>();
</script>

<template>
  <DatePickerRoot
    ref="el"
    v-model="$model"
    v-model:open="$open"
    class="f-date-picker-root"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </DatePickerRoot>
</template>
