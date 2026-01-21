<script setup lang="ts">
const { mode } = useFontMode();

const useIdFunction = () => useId();

useHead({
  htmlAttrs: {
    lang: "en",
    class: computed(() => `font-${mode.value}`),
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

.font-monospace {
  font-family: var(--ref-font-mono);
}

.font-monospace code,
.font-monospace pre,
.font-monospace kbd {
  font-family: var(--ref-font-mono);
}

.font-sans {
  font-family: var(--ref-font-sans);
}

.font-sans code,
.font-sans pre,
.font-sans kbd {
  font-family: var(--ref-font-mono);
}

::selection {
  background: var(--sys-primary);
  color: var(--sys-on-primary);
}
</style>
