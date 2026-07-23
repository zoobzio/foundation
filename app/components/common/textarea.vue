<script lang="ts">
import type {
  TextareaBindings,
  TextareaContext,
  TextareaProps,
} from "#foundation/types/common/textarea";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const {
  placeholder,
  disabled,
  required,
  name,
  rows,
  modifiers,
  tokens,
  aria,
} = defineProps<TextareaProps>();

const el = useTemplateRef<HTMLTextAreaElement>("el");

const bindings = computed<TextareaBindings>(() =>
  useBindings<"textarea">(modifiers, tokens, aria),
);

const ctx = computed<TextareaContext>(() => ({
  placeholder,
  disabled,
  required,
  name,
  rows,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
</script>

<template>
  <textarea
    ref="el"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    :name="name"
    :rows="rows"
    class="f-textarea"
    v-bind="bindings"
  />
</template>
