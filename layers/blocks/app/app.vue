<script setup lang="ts">
const useIdFunction = () => useId();

useHead({
  htmlAttrs: {
    lang: "en",
  },
});
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <TooltipProvider>
      <NuxtLoadingIndicator color="var(--sys-primary)" :threshold="0" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </TooltipProvider>
  </ConfigProvider>
</template>

<style>
html,
body {
  background: var(--sys-surface);
}

::selection {
  background: var(--sys-secondary);
  color: var(--sys-on-secondary);
}
</style>
