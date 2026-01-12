<script setup lang="ts">
import type { H6Props } from "../types/h6";

const { tokens } = defineProps<H6Props>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <h6 :style="styles.h6" class="f-h6">
    <slot />
  </h6>
</template>

<style>
@import '#build/untheme/h6.css';
</style>
