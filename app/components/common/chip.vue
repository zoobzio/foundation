<script lang="ts">
import type {
  ChipContext,
  ChipEmits,
  ChipProps,
  ChipSlots,
} from "../../types/common/chip";

import { useTemplateRef } from "#imports";
import { useBindings } from "../../composables/bindings";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, disabled, modifiers, tokens, aria } = defineProps<ChipProps>();

const emit = defineEmits<ChipEmits>();

const el = useTemplateRef<HTMLButtonElement>("el");

const bindings = useBindings<"chip">(() => ({
  modifiers,
  tokens,
  aria,
  forward: {},
}));

const ctx = useContext<ChipContext>("chip", () => ({
  label,
  disabled,
  modifiers,
  tokens,
  aria,
  bindings: bindings.value,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<ChipSlots>();
</script>

<template>
  <button
    ref="el"
    type="button"
    :disabled="disabled"
    class="f-chip"
    v-bind="bindings"
    @click="emit('click', $event)"
  >
    <slot v-bind="ctx">{{ label }}</slot>
  </button>
</template>
