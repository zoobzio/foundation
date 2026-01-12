<script setup lang="ts">
import type { PProps } from "../types/p";

const { tokens } = defineProps<PProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <p :style="styles.p" class="f-p">
    <slot />
  </p>
</template>

<style>
@import '#build/untheme/p.css';
</style>
