<script setup lang="ts">
const { tokens } = defineProps<H5Props>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <h5 :style="styles.h5" class="f-h5">
    <slot />
  </h5>
</template>

<style>
@import '#build/untheme/h5.css';
</style>
