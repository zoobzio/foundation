<script setup lang="ts">
const { tokens } = defineProps<OlProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <ol :style="styles.ol" class="f-ol">
    <slot />
  </ol>
</template>

<style>
@import '#build/untheme/ol.css';
</style>
