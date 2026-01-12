<script setup lang="ts">
import type { CardProps } from "../types/card";

const { tokens } = defineProps<CardProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <div :style="styles.card" class="f-card">
    <slot />
  </div>
</template>

<style>
@import '#build/untheme/card.css';
</style>
