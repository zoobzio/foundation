<script lang="ts">
import type {
  SelectRootContext,
  SelectRootEmits,
  SelectRootProps,
  SelectRootSlots,
} from "../../../types/common/select/root";
import type { ComponentPublicInstance } from "vue";

import { SelectRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useModel } from "../../../composables/model";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const {
  modelValue,
  open = undefined,
  ...rest
} = defineProps<SelectRootProps>();

const emit = defineEmits<SelectRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const $open = useModel(
  () => open,
  (v) => emit("update:open", v),
  { default: false },
);

const forward = useForwardProps(rest);

const ctx = useContext<SelectRootContext>("select-root", () => ({
  ...forward.value,
  modelValue: $model,
  open: $open,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<SelectRootSlots>();
</script>

<template>
  <SelectRoot
    ref="el"
    v-model="$model"
    v-model:open="$open"
    class="f-select-root"
    v-bind="forward"
  >
    <slot v-bind="ctx" />
  </SelectRoot>
</template>
