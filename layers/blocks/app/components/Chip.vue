<script setup lang="ts">
import type { ChipProps, ChipEmits } from "../types/chip";

const { label, closable } = defineProps<ChipProps>();
const emit = defineEmits<ChipEmits>();

const handleClick = () => {
  if (closable) emit('close');
};
</script>

<template>
  <button
    v-if="closable"
    type="button"
    class="f-chip f-chip--closable"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
    <Icon alias="close" class="f-chip-close" />
  </button>
  <span v-else class="f-chip">
    <slot>{{ label }}</slot>
  </span>
</template>

