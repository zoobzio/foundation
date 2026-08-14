<script lang="ts">
import type {
  CheckboxRootContext,
  CheckboxRootEmits,
  CheckboxRootProps,
  CheckboxRootSlots,
  CheckboxRootForward,
} from "../../../types/common/checkbox/root";
import type { ComponentPublicInstance } from "vue";

import { CheckboxRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../../composables/bindings";
import { useModel } from "../../../composables/model";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const {
  modelValue = undefined,
  modifiers,
  tokens,
  aria,
  ...rest
} = defineProps<CheckboxRootProps>();

const emit = defineEmits<CheckboxRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel(
  () => modelValue ?? undefined,
  (v) => emit("update:modelValue", v),
);

const forward = useForwardProps<CheckboxRootForward>(rest);

const bindings = useBindings<"checkbox-root", CheckboxRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<CheckboxRootContext>("checkbox-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<CheckboxRootSlots>();
</script>

<template>
  <CheckboxRoot
    ref="el"
    v-model="$model"
    class="f-checkbox-root"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx" />
  </CheckboxRoot>
</template>
