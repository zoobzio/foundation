<script setup lang="ts">
const useIdFunction = () => useId();

useHead({
  htmlAttrs: {
    lang: 'en'
  }
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
  font-family: var(--ref-font-sans);
}

code, pre, kbd {
  font-family: var(--ref-font-mono);
}

::selection {
  background: var(--sys-primary);
  color: var(--sys-on-primary);
}
</style>
