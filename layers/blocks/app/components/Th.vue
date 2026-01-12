<script setup lang="ts">
import type { ThProps } from "../types/th";

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
