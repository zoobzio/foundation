<script setup lang="ts">
import type { FormLabelProps } from "../types/form-label";

const { for: htmlFor, tokens } = defineProps<FormLabelProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <label :for="htmlFor" :style="styles.label" class="f-label">
    <slot />
  </label>
</template>

<style>
@import '#build/untheme/label.css';
</style>
