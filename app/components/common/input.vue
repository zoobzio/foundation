<script lang="ts">
import type {
  InputContext,
  InputEmits,
  InputProps,
} from "../../types/common/input";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const {
  type = "text",
  placeholder,
  disabled,
  required,
  name,
  modifiers,
  tokens,
  aria,
} = defineProps<InputProps>();

const emit = defineEmits<InputEmits>();

const el = useTemplateRef<HTMLInputElement>("el");

const bindings = useBindings<"input">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<InputContext>("input", () => ({
  type,
  placeholder,
  disabled,
  required,
  name,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <input
    ref="el"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :name="name"
    class="f-input"
    v-bind="bindings"
    @input="emit('input', $event)"
    @change="emit('change', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
</template>
