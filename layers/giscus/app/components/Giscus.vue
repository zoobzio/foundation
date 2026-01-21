<script setup lang="ts">
import GiscusWidget from "@giscus/vue";

const appConfig = useAppConfig();
const { mode } = useUntheme();

const config = computed(() => appConfig.giscus);

const theme = computed(() => (mode.value === "dark" ? "dark" : "light"));
</script>

<template>
  <GiscusWidget
    v-if="config"
    :repo="config.repo"
    :repo-id="config.repoId"
    :category="config.category"
    :category-id="config.categoryId"
    :mapping="config.mapping ?? 'pathname'"
    :term="config.term"
    :reactions-enabled="config.reactionsEnabled !== false ? '1' : '0'"
    :emit-metadata="config.emitMetadata ? '1' : '0'"
    :input-position="config.inputPosition ?? 'bottom'"
    :theme="theme"
    :lang="config.lang ?? 'en'"
    :loading="config.loading ?? 'lazy'"
  />
</template>
