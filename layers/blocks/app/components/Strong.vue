<script setup lang="ts">
import type { StrongProps } from "../types/strong";

const { tokens } = defineProps<StrongProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <strong :style="styles.strong" class="f-strong">
    <slot />
  </strong>
</template>

<style>
@import '#build/untheme/strong.css';
</style>
