<script setup lang="ts">
import type { TheadProps } from "../types/thead";

const { tokens } = defineProps<TheadProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <thead :style="styles.thead" class="f-thead">
    <slot />
  </thead>
</template>

<style>
@import '#build/untheme/thead.css';
</style>
