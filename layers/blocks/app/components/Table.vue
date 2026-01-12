<script setup lang="ts">
import type { TableProps } from "../types/table";

const { tokens } = defineProps<TableProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <table :style="styles.table" class="f-table">
    <slot />
  </table>
</template>

<style>
@import '#build/untheme/table.css';
</style>
