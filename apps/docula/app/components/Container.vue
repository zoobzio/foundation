<script setup lang="ts">
const { tokens } = defineProps<{
  tokens?: Tokens<"container">;
}>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <div :style="styles.container" class="f-container">
    <slot />
  </div>
</template>

<style>
@import '#build/untheme/container.css';
</style>
