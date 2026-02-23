<script setup lang="ts">
const route = useRoute();

// Collection config from app config (single collection mode)
const { collection: collectionConfig } = useAppConfig();
const { versions } = useVersion();

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

// Check if this is a version landing page (e.g., /v1.0.0)
const isVersionLanding = computed(() => {
  const path = contentPath.value.replace(/^\//, "");
  return versions.includes(path);
});

// Query content for article view (only if not a version landing)
const { data: content } = await useAsyncData(
  `content-${contentPath.value}`,
  async () => {
    if (isVersionLanding.value) return null;
    return queryCollection(collection).path(contentPath.value).first();
  },
);

// Set layout based on content type
definePageMeta({
  layout: false,
});

const layout = computed(() => (isVersionLanding.value ? "default" : "article"));

if (!isVersionLanding.value && !content.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useHead({
  title: isVersionLanding.value
    ? collectionConfig.title
    : (content.value?.title ?? "Docula"),
});

// Extract version prefix from path for filtering ContentTable
const versionPrefix = computed(() => {
  const match = contentPath.value.match(/^\/(v[\d.]+)/);
  return match ? match[1] : "";
});
</script>

<template>
  <NuxtLayout :name="layout">
    <!-- Version landing page -->
    <Container v-if="isVersionLanding">
      <Section>
        <Hero
          :tagline="collectionConfig.hero.tagline"
          :description="collectionConfig.hero.description"
          :action="collectionConfig.hero.action"
        >
          <template v-if="collectionConfig.hero.example" #showcase>
            <CodeExample
              :code="collectionConfig.hero.example.code"
              :lang="collectionConfig.hero.example.lang"
            />
          </template>
        </Hero>
        <ContentTable :collection="collection" :version-prefix="versionPrefix" />
      </Section>
    </Container>

    <!-- Article page -->
    <DocsArticle
      v-else
      :collection="collection"
      :path="contentPath"
      :content="content!"
      :repo="collectionConfig.repo"
    />
  </NuxtLayout>
</template>
