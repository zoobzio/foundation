<script setup lang="ts">
const useIdFunction = () => useId();
const { resolve } = useUntheme();
</script>

<template>
  <ConfigProvider :use-id="useIdFunction">
    <TooltipProvider>
      <NuxtLoadingIndicator
        :color="resolve('sys-primary') ?? undefined"
        :threshold="0"
      />
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
  background: var(--sys-primary);
  color: var(--sys-on-primary);
}
</style>
