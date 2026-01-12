<script setup lang="ts">
import type { ChipProps } from "../types/chip";

const { label, tokens } = defineProps<ChipProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <span :style="styles.chip" class="f-chip">
    <slot>{{ label }}</slot>
  </span>
</template>

<style>
@import '#build/untheme/chip.css';
</style>
