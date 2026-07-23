<script lang="ts">
import type {
  ButtonBindings,
  ButtonContext,
  ButtonProps,
  ButtonSlots,
} from "#foundation/types/common/button";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
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

defineSlots<ButtonSlots>();

const el = useTemplateRef<HTMLButtonElement>("el");

const bindings = computed<ButtonBindings>(() =>
  useBindings<"button">(modifiers, tokens, aria),
);

const ctx = computed<ButtonContext>(() => ({
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
</script>

<template>
  <button
    ref="el"
    :type="type"
    :disabled="disabled"
    class="f-button"
    v-bind="bindings"
  >
    <slot :ctx="ctx">{{ label }}</slot>
  </button>
</template>
