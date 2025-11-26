<script setup lang="ts">
const { src, alt } = defineProps<{
  src: string;
  alt?: string;
}>();
</script>

<template>
  <Img :src="src" :alt="alt" />
</template>
