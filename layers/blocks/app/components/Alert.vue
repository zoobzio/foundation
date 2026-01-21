<script setup lang="ts">
import type { AlertProps } from "../types/alert";

const { icon, variant = "note" } = defineProps<AlertProps>();
</script>

<template>
  <div :class="`f-alert-${variant}`">
    <span v-if="icon" :class="`f-alert-${variant}-icon`">
      <Icon :alias="icon" />
    </span>
    <slot />
  </div>
</template>

<style>
@import '#build/untheme/alert-note.css';
@import '#build/untheme/alert-note-icon.css';
@import '#build/untheme/alert-tip.css';
@import '#build/untheme/alert-tip-icon.css';
@import '#build/untheme/alert-important.css';
@import '#build/untheme/alert-important-icon.css';
@import '#build/untheme/alert-warning.css';
@import '#build/untheme/alert-warning-icon.css';
@import '#build/untheme/alert-caution.css';
@import '#build/untheme/alert-caution-icon.css';
</style>
