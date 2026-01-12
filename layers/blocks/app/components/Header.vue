<script setup lang="ts">
import type { HeaderProps } from "../types/header";

const { tokens } = defineProps<HeaderProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <header :style="styles.header" class="f-header">
    <slot />
  </header>
</template>

<style>
@import '#build/untheme/header.css';
</style>
