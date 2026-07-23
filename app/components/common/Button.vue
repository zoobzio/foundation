<script lang="ts">
import type { ButtonProps } from "#foundation/types/common/button";
import { useTemplateRef } from "#imports";
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

const bindings = useBindings(modifiers, tokens, aria);

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <button
    ref="el"
    :type="type"
    :disabled="disabled"
    class="f-button"
    v-bind="bindings"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
