<script setup lang="ts">
defineProps<{
  href?: string;
  target?: "_self" | "_blank";
}>();
</script>

<template>
  <Anchor :href="href" :target="target"><slot /></Anchor>
</template>
