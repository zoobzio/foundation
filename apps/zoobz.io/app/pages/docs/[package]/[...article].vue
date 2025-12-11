<script setup lang="ts">
import type { PageCollections } from "@nuxt/content";

definePageMeta({
  layout: "article",
});

const route = useRoute();
const appConfig = useAppConfig();

const collection = computed(() => route.params.package as keyof PageCollections);
const articlePath = computed(() => {
  const segments = route.params.article;
  return "/" + ((segments as string[])?.join("/") || "");
});

const collectionConfig = computed(() =>
  appConfig.collections?.find(
    (c: { key: string }) => c.key === collection.value,
  ),
);

const { data: content } = await useAsyncData(
  `content-${String(collection.value)}-${articlePath.value}`,
  () => queryCollection(collection.value).path(articlePath.value).first(),
);

const breadcrumbs = computed<Link[]>(() => {
  const items: Link[] = [];

  items.push({
    label: collectionConfig.value?.title || collection.value,
    to: `/docs/${collection.value}`,
  });

  const segments = route.params.article as string[] | undefined;

  if (segments && segments.length > 1) {
    const topFolder = segments[0];
    const folderLabel = topFolder.replace(/^\d+\./, "");
    items.push({
      label: folderLabel.charAt(0).toUpperCase() + folderLabel.slice(1),
      to: route.path,
    });
  } else if (content.value) {
    items.push({
      label: content.value.title,
      to: route.path,
    });
  }

  return items;
});
</script>

<template>
  <DocsArticle
    v-if="content"
    :collection="collection"
    :path="articlePath"
    :breadcrumbs="breadcrumbs"
    :content="content"
  />
</template>
