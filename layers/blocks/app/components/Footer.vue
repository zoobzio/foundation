<script setup lang="ts">
import type { FooterProps } from "../types/footer";

const { tokens } = defineProps<FooterProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <footer :style="styles.footer" class="f-footer">
    <slot />
  </footer>
</template>

<style>
@import '#build/untheme/footer.css';
</style>
