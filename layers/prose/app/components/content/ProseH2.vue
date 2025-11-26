<script setup lang="ts">
const { id } = defineProps<{
  id?: string;
}>();
</script>

<template>
  <H2 :id="id">
    <slot />
  </H2>
</template>
