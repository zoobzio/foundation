<script setup lang="ts">
import type { LiProps } from "../types/li";

const { tokens } = defineProps<LiProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <li :style="styles.li" class="f-li">
    <slot />
  </li>
</template>

<style>
@import '#build/untheme/li.css';
</style>
