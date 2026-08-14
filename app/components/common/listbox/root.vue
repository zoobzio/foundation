<script lang="ts">
import type {
  ListboxRootContext,
  ListboxRootEmits,
  ListboxRootProps,
  ListboxRootSlots,
  ListboxValue,
} from "../../../types/common/listbox/root";
import type { ComponentPublicInstance } from "vue";

import { ListboxRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useModel } from "../../../composables/model";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const { modelValue, ...rest } = defineProps<ListboxRootProps>();

const emit = defineEmits<ListboxRootEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel<ListboxValue>(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const forward = useForwardProps(rest);

const ctx = useContext<ListboxRootContext>("listbox-root", () => ({
  ...forward.value,
  modelValue: $model,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ListboxRootSlots>();
</script>

<template>
  <ListboxRoot
    ref="el"
    v-model="$model"
    class="f-listbox-root"
    v-bind="forward"
  >
    <slot v-bind="ctx" />
  </ListboxRoot>
</template>
