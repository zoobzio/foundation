<script setup lang="ts">
import type { CaptionProps } from "../types/caption";

const { icon, tokens } = defineProps<CaptionProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <div :style="styles.caption" class="f-caption">
    <Icon v-if="icon" :alias="icon" />
    <slot />
  </div>
</template>

<style>
@import '#build/untheme/caption.css';
</style>
