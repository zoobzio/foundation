<script setup lang="ts">
import type { BlockquoteProps } from "../types/blockquote";

const { tokens } = defineProps<BlockquoteProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <blockquote :style="styles.blockquote" class="f-blockquote">
    <slot />
  </blockquote>
</template>

<style>
@import '#build/untheme/blockquote.css';
</style>
