<script setup lang="ts">
import type { TrProps } from "../types/tr";

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
