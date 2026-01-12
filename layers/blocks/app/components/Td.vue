<script setup lang="ts">
import type { TdProps } from "../types/td";

const { tokens } = defineProps<TdProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <td :style="styles.td" class="f-td">
    <slot />
  </td>
</template>

<style>
@import '#build/untheme/td.css';
</style>
