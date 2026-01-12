<script setup lang="ts">
const { tokens } = defineProps<TrProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <tr :style="styles.tr" class="f-tr">
    <slot />
  </tr>
</template>

<style>
@import '#build/untheme/tr.css';
</style>
