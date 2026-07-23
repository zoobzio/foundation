<script lang="ts">
import type {
  InputBindings,
  InputContext,
  InputProps,
} from "#foundation/types/common/input";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
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

const el = useTemplateRef<HTMLInputElement>("el");

const bindings = computed<InputBindings>(() =>
  useBindings<"input">(modifiers, tokens, aria),
);

const ctx = computed<InputContext>(() => ({
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
  />
</template>
