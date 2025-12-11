<script setup lang="ts">
const appConfig = useAppConfig();
const collections = computed(() => appConfig.collections || []);
</script>

<template>
  <DocsLanding :collections="collections" />
</template>
