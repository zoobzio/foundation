<script setup lang="ts">
definePageMeta({
  layout: "article",
});

const route = useRoute();

// Collection config from app config (single collection mode)
const { collection: collectionConfig } = useAppConfig();

if (!collectionConfig?.key) {
  throw createError({
    statusCode: 500,
    statusMessage:
      "Docula: No collection configured. Define `collection` in app.config.ts",
  });
}

const collection = collectionConfig.key;

// Full slug is the content path
const contentPath = computed(() => {
  const s = route.params.slug;
  if (!s || (Array.isArray(s) && s.length === 0)) return "";
  return `/${Array.isArray(s) ? s.join("/") : s}`;
});

// Root path means collection landing
const isCollectionRoot = computed(() => contentPath.value === "");

// Query navigation (needed for collection view)
const { data: navigation } = await useAsyncData(
  `navigation-${collection}`,
  () => queryCollectionNavigation(collection),
);

// Query content (for article view)
const { data: content } = await useAsyncData(
  `content-${contentPath.value}`,
  () =>
    queryCollection(collection)
      .path(contentPath.value || "/index")
      .first(),
  { immediate: !isCollectionRoot.value },
);

useHead({
  title: "Testing~",
});
</script>

<template>
  <DocsCollection
    v-if="isCollectionRoot && navigation"
    :collection="collection"
    :title="collectionConfig.title"
    :description="collectionConfig.description"
    :navigation="navigation"
  />
  <DocsArticle
    v-else-if="content"
    :collection="collection"
    :path="contentPath"
    :content="content"
    :repo="collectionConfig.repo"
  />
  <Section v-else>
    <Article>
      <H1>Not Found</H1>
      <P>Content not found at {{ contentPath }}</P>
    </Article>
  </Section>
</template>
