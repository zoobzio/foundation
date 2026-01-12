<script setup lang="ts">
import type { EmProps } from "../types/em";

const { tokens } = defineProps<EmProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <em :style="styles.em" class="f-em">
    <slot />
  </em>
</template>

<style>
@import '#build/untheme/em.css';
</style>
