<script lang="ts">
import type {
  ToggleGroupRootContext,
  ToggleGroupRootEmits,
  ToggleGroupRootForward,
  ToggleGroupRootProps,
  ToggleGroupRootSlots,
} from "#foundation/types/common/toggle-group/root";
import type { ComponentPublicInstance } from "vue";

import { ToggleGroupRoot, useForwardProps } from "reka-ui";

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
} = defineProps<ToggleGroupRootProps>();

const emit = defineEmits<ToggleGroupRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const forward = useForwardProps(rest);

const bindings = useBindings<"toggle-group-root", ToggleGroupRootForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ToggleGroupRootContext>("toggle-group-root", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ToggleGroupRootSlots>();
</script>

<template>
  <ToggleGroupRoot
    ref="el"
    v-model="$model"
    class="f-toggle-group-root"
    v-bind="bindings"
  >
    <slot v-bind="ctx" />
  </ToggleGroupRoot>
</template>
