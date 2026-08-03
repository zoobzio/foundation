<script lang="ts">
import type {
  FormContext,
  FormEmits,
  FormProps,
  FormSlots,
} from "#foundation/types/common/form";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const { modifiers, tokens, aria } = defineProps<FormProps>();

const emit = defineEmits<FormEmits>();

const el = useTemplateRef<HTMLFormElement>("el");

const bindings = useBindings<"form">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<FormContext>("form", () => ({
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<FormSlots>();
</script>

<template>
  <form
    ref="el"
    class="f-form"
    v-bind="bindings"
    @submit="emit('submit', $event)"
    @reset="emit('reset', $event)"
  >
    <slot v-bind="ctx" />
  </form>
</template>
