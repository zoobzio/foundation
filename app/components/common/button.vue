<script lang="ts">
import type {
  ButtonContext,
  ButtonEmits,
  ButtonProps,
  ButtonSlots,
} from "#foundation/types/common/button";

import { useTemplateRef } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  label,
  type = "button",
  disabled,
  modifiers,
  tokens,
  aria,
} = defineProps<ButtonProps>();

const emit = defineEmits<ButtonEmits>();

const el = useTemplateRef<HTMLButtonElement>("el");

const bindings = useBindings<"button">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<ButtonContext>("button", () => ({
  label,
  type,
  disabled,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ButtonSlots>();
</script>

<template>
  <button
    ref="el"
    :type="type"
    :disabled="disabled"
    class="f-button"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx">{{ label }}</slot>
  </button>
</template>
