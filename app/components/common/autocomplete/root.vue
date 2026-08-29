<script lang="ts">
import type {
  AutocompleteRootContext,
  AutocompleteRootEmits,
  AutocompleteRootProps,
  AutocompleteRootSlots,
} from "../../../types/common/autocomplete/root";
import type { ComponentPublicInstance } from "vue";

import { AutocompleteRoot, useForwardProps } from "reka-ui";

import { useTemplateRef } from "#imports";
import { useModel } from "../../../composables/model";
import { useContext } from "../../../composables/context";
</script>

<script setup lang="ts">
const {
  modelValue,
  open = undefined,
  ...rest
} = defineProps<AutocompleteRootProps>();

const emit = defineEmits<AutocompleteRootEmits>();

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

const ctx = useContext<AutocompleteRootContext>("autocomplete-root", () => ({
  ...forward.value,
  modelValue: $model,
  open: $open,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<AutocompleteRootSlots>();
</script>

<template>
  <AutocompleteRoot
    ref="el"
    v-model="$model"
    v-model:open="$open"
    class="f-autocomplete-root"
    v-bind="forward"
  >
    <slot v-bind="ctx" />
  </AutocompleteRoot>
</template>
