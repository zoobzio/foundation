<script lang="ts">
import type {
  TextareaContext,
  TextareaEmits,
  TextareaProps,
} from "#foundation/types/common/textarea";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
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

const emit = defineEmits<TextareaEmits>();

const el = useTemplateRef<HTMLTextAreaElement>("el");

const bindings = useBindings<"textarea">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<TextareaContext>("textarea", () => ({
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
    @input="emit('input', $event)"
    @change="emit('change', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  />
</template>
