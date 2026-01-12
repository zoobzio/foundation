<script setup lang="ts">
import type { H2Props } from "../types/h2";

const { tokens } = defineProps<H2Props>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <h2 :style="styles.h2" class="f-h2">
    <slot />
  </h2>
</template>

<style>
@import '#build/untheme/h2.css';
</style>
