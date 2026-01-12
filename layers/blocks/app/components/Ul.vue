<script setup lang="ts">
import type { UlProps } from "../types/ul";

const { tokens } = defineProps<UlProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <ul :style="styles.ul" class="f-ul">
    <slot />
  </ul>
</template>

<style>
@import '#build/untheme/ul.css';
</style>
