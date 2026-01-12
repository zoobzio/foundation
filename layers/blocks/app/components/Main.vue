<script setup lang="ts">
import type { MainProps } from "../types/main";

const { tokens } = defineProps<MainProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <main :style="styles.main" class="f-main">
    <slot />
  </main>
</template>

<style>
@import '#build/untheme/main.css';
</style>
