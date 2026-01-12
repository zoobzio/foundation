<script setup lang="ts">
import type { H4Props } from "../types/h4";

const { tokens } = defineProps<H4Props>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <h4 :style="styles.h4" class="f-h4">
    <slot />
  </h4>
</template>

<style>
@import '#build/untheme/h4.css';
</style>
