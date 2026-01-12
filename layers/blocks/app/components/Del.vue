<script setup lang="ts">
import type { DelProps } from "../types/del";

const { tokens } = defineProps<DelProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <del :style="styles.del" class="f-del">
    <slot />
  </del>
</template>

<style>
@import '#build/untheme/del.css';
</style>
