<script setup lang="ts">
import type { BannerProps } from "../types/banner";

const { icon, tokens } = defineProps<BannerProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <div :style="styles.banner" class="f-banner">
    <Icon v-if="icon" :alias="icon" />
    <slot />
  </div>
</template>

<style>
@import '#build/untheme/banner.css';
</style>
