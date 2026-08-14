<script lang="ts">
import type {
  RadioGroupRootContext,
  RadioGroupRootEmits,
  RadioGroupRootForward,
  RadioGroupRootProps,
  RadioGroupRootSlots,
} from "../../../types/common/radio-group/root";
import type { ComponentPublicInstance } from "vue";

import { RadioGroupRoot, useForwardProps } from "reka-ui";

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
} = defineProps<RadioGroupRootProps>();

const emit = defineEmits<RadioGroupRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const forward = useForwardProps(rest);

const bindings = useBindings<"radio-group-root", RadioGroupRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<RadioGroupRootContext>("radio-group-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<RadioGroupRootSlots>();
</script>

<template>
  <RadioGroupRoot
    ref="el"
    v-model="$model"
    class="f-radio-group-root"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </RadioGroupRoot>
</template>
