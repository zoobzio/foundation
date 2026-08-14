<script lang="ts">
import type {
  CalendarRootContext,
  CalendarRootEmits,
  CalendarRootForward,
  CalendarRootProps,
  CalendarRootSlots,
} from "../../../types/common/calendar/root";
import type { DateValue } from "@internationalized/date";
import type { ComponentPublicInstance } from "vue";

import { CalendarRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useModel } from "../../../composables/model";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const {
  modelValue,
  modifiers,
  tokens,
  aria,
  ...rest
} = defineProps<CalendarRootProps>();

const emit = defineEmits<CalendarRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<DateValue | undefined>(
  () => modelValue ?? undefined,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const forward = useForwardProps<CalendarRootForward>(rest);

const bindings = useBindings<"calendar-root", CalendarRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CalendarRootContext>("calendar-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CalendarRootSlots>();
</script>

<template>
  <CalendarRoot
    ref="el"
    v-model="$model"
    class="f-calendar-root"
    v-bind="bindings"
  >
    <template #default="slotProps">
      <slot v-bind="{ ...ctx, ...slotProps, modelValue: ctx.modelValue }" />
    </template>
  </CalendarRoot>
</template>
