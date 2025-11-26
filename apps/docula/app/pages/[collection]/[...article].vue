<script setup lang="ts">
definePageMeta({
  layout: "article",
});

const route = useRoute("collection-article");
const appConfig = useAppConfig();

const collection = computed(() => route.params.collection);
const articlePath = computed(() => {
  const segments = route.params.article;
  return "/" + (segments?.join("/") || "");
});

// Get collection config from app.config
const collectionConfig = computed(() =>
  appConfig.collections?.find(
    (c: { key: string }) => c.key === collection.value,
  ),
);

const { data: content } = await useAsyncData(
  `content-${collection.value}-${articlePath.value}`,
  () => queryCollection(collection.value).path(articlePath.value).first(),
);

// Generate breadcrumbs from path
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [];

  // Add collection link
  items.push({
    label: collectionConfig.value?.title || collection.value,
    to: `/${collection.value}`,
  });

  // Add article title as current page
  if (content.value) {
    items.push({
      label: content.value.title,
    });
  }

  return items;
});
</script>

<template>
  <Nav
    :tokens="{
      nav: {
        'border-right-width': 'ref-hairline',
        'border-right-style': 'ref-border-style-solid',
        'border-color': 'sys-outline',
      },
    }"
  >
    <Aside>
      <ContentTree :collection="collection as 'example'" />
    </Aside>
  </Nav>
  <Section>
    <Breadcrumbs :items="breadcrumbs" />
    <Article>
      <ContentRenderer v-if="content" :value="content" />
    </Article>
    <Attribution
      v-if="content"
      :author="content.author"
      :published="content.published"
      :tags="content.tags"
    />
    <Surround :collection="collection as 'example'" :path="articlePath" />
  </Section>
  <Nav
    :tokens="{
      nav: {
        'border-left-width': 'ref-hairline',
        'border-left-style': 'ref-border-style-solid',
        'border-color': 'sys-outline',
      },
    }"
  >
    <Aside>
      <Toc v-if="content?.body?.toc?.links" :links="content.body.toc.links" />
    </Aside>
  </Nav>
</template>
