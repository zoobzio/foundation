<script lang="ts">
import type {
  RangeCalendarRootContext,
  RangeCalendarRootEmits,
  RangeCalendarRootForward,
  RangeCalendarRootProps,
  RangeCalendarRootSlots,
} from "#foundation/types/common/range-calendar/root";
import type { ComponentPublicInstance } from "vue";

import type { DateRange } from "reka-ui";

import { RangeCalendarRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  modelValue,
  modifiers,
  tokens,
  aria,
  ...rest
} = defineProps<RangeCalendarRootProps>();

const emit = defineEmits<RangeCalendarRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateRange | undefined>(
  () => modelValue ?? undefined,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const forward = useForwardProps<RangeCalendarRootForward>(rest);

const bindings = useBindings<"range-calendar-root", RangeCalendarRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RangeCalendarRootContext>("range-calendar-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RangeCalendarRootSlots>();
</script>

<template>
  <RangeCalendarRoot
    ref="el"
    v-model="$model"
    class="f-range-calendar-root"
    v-bind="bindings"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps, modelValue: ctx.modelValue }" />
    </template>
  </RangeCalendarRoot>
</template>
