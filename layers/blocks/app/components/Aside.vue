<script setup lang="ts">
const { tokens } = defineProps<AsideProps>();

const styles = useTokenStyle(tokens);
</script>

<template>
  <aside :style="styles.aside" class="f-aside">
    <slot />
  </aside>
</template>

<style>
@import '#build/untheme/aside.css';
</style>
