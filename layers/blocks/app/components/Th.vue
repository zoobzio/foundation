<script setup lang="ts">
const { tokens } = defineProps<ThProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <th :style="styles.th" class="f-th">
    <slot />
  </th>
</template>

<style>
@import '#build/untheme/th.css';
</style>
