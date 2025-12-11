<script setup lang="ts">
import type { PageCollections } from "@nuxt/content";

definePageMeta({
  layout: "collection",
});

const route = useRoute();
const appConfig = useAppConfig();

const collection = computed(() => route.params.package as keyof PageCollections);

const collectionConfig = computed(() =>
  appConfig.collections?.find(
    (c: { key: string }) => c.key === collection.value,
  ),
);

const { data: navigation } = await useAsyncData(
  `content-accordion-${String(collection.value)}`,
  () => queryCollectionNavigation(collection.value),
);
</script>

<template>
  <DocsCollection
    v-if="navigation"
    :collection="collection"
    :title="collectionConfig?.title || collection"
    :description="collectionConfig?.description"
    :navigation="navigation"
  />
</template>
