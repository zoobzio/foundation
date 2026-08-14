<script lang="ts">
import type {
  DateRangePickerRootContext,
  DateRangePickerRootEmits,
  DateRangePickerRootForward,
  DateRangePickerRootProps,
  DateRangePickerRootSlots,
} from "../../../types/common/date-range-picker/root";
import type { DateRange } from "reka-ui";
import type { ComponentPublicInstance } from "vue";

import { DateRangePickerRoot, useForwardProps } from "reka-ui";

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
} = defineProps<DateRangePickerRootProps>();

const emit = defineEmits<DateRangePickerRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateRange | undefined>(
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

const bindings = useBindings<"date-range-picker-root", DateRangePickerRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<DateRangePickerRootContext>("date-range-picker-root", () => ({
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
defineSlots<DateRangePickerRootSlots>();
</script>

<template>
  <DateRangePickerRoot
    ref="el"
    v-model="$model"
    v-model:open="$open"
    class="f-date-range-picker-root"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </DateRangePickerRoot>
</template>
