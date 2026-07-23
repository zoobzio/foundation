<script lang="ts">
import type {
  ChipBindings,
  ChipContext,
  ChipProps,
  ChipSlots,
} from "#foundation/types/common/chip";

import { useTemplateRef, computed } from "#imports";
import { useBindings } from "#foundation/composables/bindings";
</script>

<script setup lang="ts">
const { label, disabled, modifiers, tokens, aria } = defineProps<ChipProps>();

defineSlots<ChipSlots>();

const el = useTemplateRef<HTMLButtonElement>("el");

const bindings = computed<ChipBindings>(() =>
  useBindings<"chip">(modifiers, tokens, aria),
);

const ctx = computed<ChipContext>(() => ({
  label,
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
    type="button"
    :disabled="disabled"
    class="f-chip"
    v-bind="bindings"
  >
    <slot :ctx="ctx">{{ label }}</slot>
  </button>
</template>
