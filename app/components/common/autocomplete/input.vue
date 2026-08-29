<script lang="ts">
import type {
  AutocompleteInputContext,
  AutocompleteInputEmits,
  AutocompleteInputForward,
  AutocompleteInputProps,
} from "../../../types/common/autocomplete/input";
import type { ComponentPublicInstance } from "vue";

import { AutocompleteInput, useForwardProps } from "reka-ui";

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
} = defineProps<AutocompleteInputProps>();

const emit = defineEmits<AutocompleteInputEmits>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const $model = useModel(
  () => modelValue ?? undefined,
  (v) => emit("update:modelValue", v),
);

const forward = useForwardProps<AutocompleteInputForward>(rest);

const bindings = useBindings<"autocomplete-input", AutocompleteInputForward>(
  () => ({
    modifiers,
    tokens,
    aria,
    forward: forward.value,
  }),
);

const ctx = useContext<AutocompleteInputContext>("autocomplete-input", () => ({
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
  <AutocompleteInput
    ref="el"
    v-model="$model"
    class="f-autocomplete-input"
    v-bind="bindings"
  />
</template>
