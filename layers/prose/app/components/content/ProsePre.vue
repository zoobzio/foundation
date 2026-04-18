<script setup lang="ts">
const { code } = defineProps<{
  code: string;
}>();
</script>

<template>
  <CodePre :code="code">
    <slot />
  </CodePre>
</template>
