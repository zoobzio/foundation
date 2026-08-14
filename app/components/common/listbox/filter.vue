<script lang="ts">
import type {
  ListboxFilterContext,
  ListboxFilterEmits,
  ListboxFilterForward,
  ListboxFilterProps,
} from "../../../types/common/listbox/filter";
import type { ComponentPublicInstance } from "vue";

import { ListboxFilter, useForwardProps } from "reka-ui";

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
} = defineProps<ListboxFilterProps>();

const emit = defineEmits<ListboxFilterEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel(
  () => modelValue ?? undefined,
  (v) => emit("update:modelValue", v),
);

const forward = useForwardProps<ListboxFilterForward>(rest);

const bindings = useBindings<"listbox-filter", ListboxFilterForward>(() => ({
  modifiers,
  tokens,
  aria,
  forward: forward.value,
}));

const ctx = useContext<ListboxFilterContext>("listbox-filter", () => ({
  ...forward.value,
  modifiers,
  tokens,
  aria,
  modelValue: $model,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <ListboxFilter
    ref="el"
    v-model="$model"
    class="f-listbox-filter"
    v-bind="bindings"
  />
</template>
