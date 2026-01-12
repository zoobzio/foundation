<script setup lang="ts">
import type { SectionProps } from "../types/section";

const { tokens } = defineProps<SectionProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <section :style="styles.section" class="f-section">
    <slot />
  </section>
</template>

<style>
@import '#build/untheme/section.css';
</style>
