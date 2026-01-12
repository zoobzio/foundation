<script setup lang="ts">
import type { GroupProps } from "../types/group";

const { tokens } = defineProps<GroupProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <div :style="styles.group" class="f-group">
    <slot />
  </div>
</template>

<style>
@import '#build/untheme/group.css';
</style>
