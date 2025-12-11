<script setup lang="ts">
import type { PageCollections } from "@nuxt/content";

definePageMeta({
  layout: "article",
});

const route = useRoute();
const appConfig = useAppConfig();

const collection = appConfig.collection as keyof PageCollections;

const articlePath = computed(() => {
  const param = route.params.article;
  const segments = Array.isArray(param) ? param : [param];
  return "/" + segments.join("/");
});

const { data: content } = await useAsyncData(
  `content-${collection}-${articlePath.value}`,
  () => queryCollection(collection).path(articlePath.value).first(),
);
</script>

<template>
  <DocsArticle
    v-if="content"
    :collection="collection"
    :path="articlePath"
    :content="content"
    :repo="appConfig.repo as string"
  />
</template>
