<script lang="ts">
import type {
  AccordionRootContext,
  AccordionRootEmits,
  AccordionRootProps,
  AccordionRootSlots,
  AccordionRootForward,
} from "../../../types/common/accordion/root";
import type { ComponentPublicInstance } from "vue";

import { AccordionRoot, useForwardProps } from "reka-ui";

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
} = defineProps<AccordionRootProps>();

const emit = defineEmits<AccordionRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
  { explicit: "modelValue" },
);

const forward = useForwardProps<AccordionRootForward>(rest);

const bindings = useBindings<"accordion-root", AccordionRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<AccordionRootContext>("accordion-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AccordionRootSlots>();
</script>

<template>
  <AccordionRoot
    ref="el"
    v-model="$model"
    class="f-accordion-root"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </AccordionRoot>
</template>
