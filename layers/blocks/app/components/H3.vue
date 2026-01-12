<script setup lang="ts">
import type { H3Props } from "../types/h3";

const { tokens } = defineProps<H3Props>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <h3 :style="styles.h3" class="f-h3">
    <slot />
  </h3>
</template>

<style>
@import '#build/untheme/h3.css';
</style>
