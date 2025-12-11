<script setup lang="ts">
import type { PageCollections } from "@nuxt/content";

definePageMeta({
  layout: "collection",
});

const appConfig = useAppConfig();
const collection = appConfig.collection as keyof PageCollections;

const { data: navigation } = await useAsyncData(
  `content-accordion-${collection}`,
  () => queryCollectionNavigation(collection),
);
</script>

<template>
  <DocsCollection
    v-if="navigation"
    :collection="collection"
    :title="appConfig.title as string"
    :description="appConfig.description as string"
    :navigation="navigation"
  />
</template>
